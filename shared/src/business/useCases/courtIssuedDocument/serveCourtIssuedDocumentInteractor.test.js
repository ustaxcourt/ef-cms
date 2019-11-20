const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');
const {
  ENTERED_AND_SERVED_EVENT_CODES,
} = require('../../entities/courtIssuedDocument/CourtIssuedDocumentConstants');
const {
  serveCourtIssuedDocumentInteractor,
} = require('./serveCourtIssuedDocumentInteractor');
const { Case } = require('../../entities/cases/Case');
const { createISODateString } = require('../../utilities/DateHandler');
const { Document } = require('../../entities/Document');
const { User } = require('../../entities/User');

const testAssetsPath = path.join(__dirname, '../../../../test-assets/');
const testOutputPath = path.join(__dirname, '../../../../test-output/');

const testPdfDocBytes = () => {
  // sample.pdf is a 1 page document
  return fs.readFileSync(testAssetsPath + 'sample.pdf');
};

describe('serveCourtIssuedDocumentInteractor', () => {
  let applicationContext;
  let updateCaseMock;
  let sendBulkTemplatedEmailMock;
  let getObjectMock;
  let saveDocumentMock;
  let testPdfDoc;
  let deleteCaseTrialSortMappingRecordsMock;

  const mockUser = {
    role: User.ROLES.docketClerk,
    userId: '123',
  };

  const dynamicallyGeneratedDocketEntries = [];
  const documentsWithCaseClosingEventCodes = ENTERED_AND_SERVED_EVENT_CODES.map(
    eventCode => {
      const documentId = uuidv4();

      dynamicallyGeneratedDocketEntries.push({
        documentId,
        filingDate: createISODateString(),
      });

      const eventCodeMap = Document.COURT_ISSUED_EVENT_CODES.find(
        entry => entry.eventCode === eventCode,
      );

      return {
        documentId,
        documentType: eventCodeMap.documentType,
        eventCode,
        userId: '123',
      };
    },
  );

  const mockCases = [
    {
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      docketNumber: '123-45',
      docketRecord: [
        {
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
          filingDate: createISODateString(),
        },
        {
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bd',
          filingDate: createISODateString(),
        },
        ...dynamicallyGeneratedDocketEntries,
      ],
      documents: [
        {
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
          documentType: 'Order',
          eventCode: 'O',
          userId: '123',
        },
        ...documentsWithCaseClosingEventCodes,
      ],
    },
  ];

  beforeEach(() => {
    testPdfDoc = testPdfDocBytes();

    updateCaseMock = jest.fn(({ caseToUpdate }) => caseToUpdate);
    deleteCaseTrialSortMappingRecordsMock = jest.fn();
    sendBulkTemplatedEmailMock = jest.fn();
    getObjectMock = jest.fn().mockReturnValue({
      promise: async () => ({
        Body: testPdfDoc,
      }),
    });

    applicationContext = {
      environment: { documentsBucketName: 'documents' },
      getCurrentUser: () => mockUser,
      getDispatchers: () => ({
        sendBulkTemplatedEmail: sendBulkTemplatedEmailMock,
      }),
      getPersistenceGateway: () => ({
        deleteCaseTrialSortMappingRecords: deleteCaseTrialSortMappingRecordsMock,
        getCaseByCaseId: ({ caseId }) => {
          return mockCases.find(mockCase => mockCase.caseId === caseId);
        },
        saveDocument: saveDocumentMock,
        updateCase: updateCaseMock,
      }),
      getStorageClient: () => ({
        getObject: getObjectMock,
      }),
      logger: {
        time: () => null,
        timeEnd: () => null,
      },
    };
  });

  it('should throw an Unathorized error if the user role does not have the SERVE_DOCUMENT permission', async () => {
    let error;

    // petitioner role does NOT have the SERVE_DOCUMENT permission
    const user = { ...mockUser, role: User.ROLES.petitioner };
    applicationContext.getCurrentUser = () => user;

    try {
      await serveCourtIssuedDocumentInteractor({
        applicationContext,
        caseId: '000-00',
        documentId: '000',
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.message).toContain('Unauthorized');
  });

  it('should throw a Not Found error if the case can not be found', async () => {
    let error;

    try {
      await serveCourtIssuedDocumentInteractor({
        applicationContext,
        caseId: '000-00',
        documentId: '000',
      });
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.message).toContain('Case 000-00 was not found');
  });

  it('should throw a Not Found error if the document can not be found', async () => {
    let error;

    try {
      await serveCourtIssuedDocumentInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentId: '000',
      });
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.message).toContain('Document 000 was not found');
  });

  it('should set the document as served and update the case', async () => {
    saveDocumentMock = jest.fn(({ document: newPdfData }) => {
      fs.writeFileSync(
        testOutputPath + 'serveCourtIssuedDocumentInteractor_1.pdf',
        newPdfData,
      );
    });

    const result = await serveCourtIssuedDocumentInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
    });

    const updatedDocument = result.documents.find(
      document =>
        document.documentId === 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
    );

    expect(updatedDocument.status).toEqual('served');
    expect(updatedDocument.servedAt).toBeTruthy();
    expect(updateCaseMock).toHaveBeenCalled();
  });

  it('should call sendBulkTemplatedEmail sending an email to all parties', async () => {
    saveDocumentMock = jest.fn(({ document: newPdfData }) => {
      fs.writeFileSync(
        testOutputPath + 'serveCourtIssuedDocumentInteractor_2.pdf',
        newPdfData,
      );
    });

    await serveCourtIssuedDocumentInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
    });

    expect(sendBulkTemplatedEmailMock).toHaveBeenCalled();
  });

  documentsWithCaseClosingEventCodes.forEach(document => {
    it(`should set the case status to closed for event code: ${document.eventCode}`, async () => {
      saveDocumentMock = jest.fn(({ document: newPdfData }) => {
        fs.writeFileSync(
          testOutputPath + 'serveCourtIssuedDocumentInteractor_3.pdf',
          newPdfData,
        );
      });

      const result = await serveCourtIssuedDocumentInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentId: document.documentId,
      });

      expect(result.status).toEqual(Case.STATUS_TYPES.closed);
      expect(deleteCaseTrialSortMappingRecordsMock).toHaveBeenCalled();
    });
  });
});
