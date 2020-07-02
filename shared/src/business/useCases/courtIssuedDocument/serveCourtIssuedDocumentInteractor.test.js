const fs = require('fs');
const path = require('path');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  COUNTRY_TYPES,
  COURT_ISSUED_EVENT_CODES,
} = require('../../entities/EntityConstants');
const {
  ENTERED_AND_SERVED_EVENT_CODES,
} = require('../../entities/courtIssuedDocument/CourtIssuedDocumentConstants');
const {
  serveCourtIssuedDocumentInteractor,
} = require('./serveCourtIssuedDocumentInteractor');
const { createISODateString } = require('../../utilities/DateHandler');
const { DOCKET_SECTION } = require('../../entities/EntityConstants');
const { PARTY_TYPES, ROLES } = require('../../entities/EntityConstants');
const { v4: uuidv4 } = require('uuid');

const testAssetsPath = path.join(__dirname, '../../../../test-assets/');
const testOutputPath = path.join(__dirname, '../../../../test-output/');

describe('serveCourtIssuedDocumentInteractor', () => {
  let testPdfDoc;
  let extendCase;

  const mockPdfUrl = 'www.example.com';
  const mockDocumentId = 'cf105788-5d34-4451-aa8d-dfd9a851b675';

  const testPdfDocBytes = () => {
    // sample.pdf is a 1 page document
    return new Uint8Array(fs.readFileSync(testAssetsPath + 'sample.pdf'));
  };

  const mockUser = {
    name: 'Docket Clerk',
    role: ROLES.docketClerk,
    userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
  };

  const mockWorkItem = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    docketNumber: '123-45',
    isQC: true,
    section: DOCKET_SECTION,
    sentBy: mockUser.name,
    sentByUserId: mockUser.userId,
    workItemId: 'b4c7337f-9ca0-45d9-9396-75e003f81e32',
  };

  const dynamicallyGeneratedDocketEntries = [];
  const documentsWithCaseClosingEventCodes = ENTERED_AND_SERVED_EVENT_CODES.map(
    eventCode => {
      const documentId = uuidv4();
      const docketRecordId = uuidv4();

      const index = dynamicallyGeneratedDocketEntries.length + 2; // 2 statically set docket records per case;

      dynamicallyGeneratedDocketEntries.push({
        description: `Docket Record ${index}`,
        docketRecordId,
        documentId,
        eventCode: 'O',
        filingDate: createISODateString(),
        index,
      });

      const eventCodeMap = COURT_ISSUED_EVENT_CODES.find(
        entry => entry.eventCode === eventCode,
      );

      return {
        documentId,
        documentType: eventCodeMap.documentType,
        eventCode,
        userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
        workItems: [mockWorkItem],
      };
    },
  );

  const mockCases = [
    {
      caseCaption: 'Caption',
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      caseType: 'Deficiency',
      contactPrimary: {
        address1: '123 Main St',
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'contact@example.com',
        name: 'Contact Primary',
        phone: '123123134',
        postalCode: '12345',
        state: 'TN',
      },
      docketNumber: '123-45',
      docketRecord: [
        {
          description: 'Docket Record 0',
          docketRecordId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
          eventCode: 'O',
          filingDate: createISODateString(),
          index: 0,
        },
        {
          description: 'Docket Record 1',
          docketRecordId: mockDocumentId,
          documentId: mockDocumentId,
          eventCode: 'OAJ',
          filingDate: createISODateString(),
          index: 1,
        },
        ...dynamicallyGeneratedDocketEntries,
      ],
      documents: [
        {
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
          documentType: 'Order',
          eventCode: 'O',
          serviceStamp: 'Served',
          signedAt: createISODateString(),
          signedByUserId: uuidv4(),
          signedJudgeName: 'Chief Judge',
          userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
          workItems: [mockWorkItem],
        },
        {
          documentId: mockDocumentId,
          documentType: 'Order that case is assigned',
          eventCode: 'OAJ',
          userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
          workItems: [mockWorkItem],
        },
        ...documentsWithCaseClosingEventCodes,
      ],
      filingType: 'Myself',
      partyType: PARTY_TYPES.petitioner,
      preferredTrialCity: 'Fresno, California',
      procedureType: 'Regular',
    },
    {
      caseCaption: 'Caption',
      caseId: 'd857e73a-636e-4aa7-9de2-b5cee8770ff0',
      caseType: 'Deficiency',
      contactPrimary: {
        address1: '123 Main St',
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Contact Primary',
        phone: '123123134',
        postalCode: '12345',
        state: 'TN',
      },
      contactSecondary: {
        address1: '123 Main St',
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Contact Secondary',
        phone: '123123134',
        postalCode: '12345',
        state: 'TN',
      },
      docketNumber: '123-45',
      docketRecord: [
        {
          description: 'Docket Record 0',
          docketRecordId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
          eventCode: 'O',
          filingDate: createISODateString(),
          index: 0,
          signedAt: createISODateString(),
          signedByUserId: uuidv4(),
          signedJudgeName: 'Chief Judge',
        },
        {
          description: 'Docket Record 0',
          docketRecordId: mockDocumentId,
          documentId: mockDocumentId,
          eventCode: 'OAJ',
          filingDate: createISODateString(),
          index: 1,
        },
        ...dynamicallyGeneratedDocketEntries,
      ],
      documents: [
        {
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
          documentType: 'Order',
          eventCode: 'O',
          serviceStamp: 'Served',
          signedAt: createISODateString(),
          signedByUserId: uuidv4(),
          signedJudgeName: 'Chief Judge',
          userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
          workItems: [mockWorkItem],
        },
        {
          documentId: mockDocumentId,
          documentType: 'Order that case is assigned',
          eventCode: 'OAJ',
          userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
          workItems: [mockWorkItem],
        },
        ...documentsWithCaseClosingEventCodes,
      ],
      filingType: 'Myself',
      isPaper: true,
      mailingDate: 'testing',
      partyType: PARTY_TYPES.petitionerSpouse,
      preferredTrialCity: 'Fresno, California',
      procedureType: 'Regular',
    },
  ];

  beforeEach(() => {
    testPdfDoc = testPdfDocBytes();
    extendCase = {};

    applicationContext.getCurrentUser.mockImplementation(() => mockUser);
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockImplementation(({ caseId }) => {
        const theCase = mockCases.find(mockCase => mockCase.caseId === caseId);
        if (theCase) {
          return {
            ...theCase,
            ...extendCase,
          };
        }
      });
    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue(mockPdfUrl);
    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(caseToUpdate => caseToUpdate);
    applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument.mockResolvedValue(1);
    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: async () => ({
        Body: testPdfDoc,
      }),
    });
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
        caseOrder: [
          {
            caseId: '46c4064f-b44a-4ac3-9dfb-9ce9f00e43f5',
          },
        ],
        createdAt: '2019-10-27T05:00:00.000Z',
        gsi1pk: 'trial-session-catalog',
        isCalendared: true,
        judge: {
          name: 'Judge Armen',
          userId: 'dabbad00-18d0-43ec-bafb-654e83405416',
        },
        maxCases: 100,
        pk: 'trial-session|959c4338-0fac-42eb-b0eb-d53b8d0195cc',
        sessionType: 'Regular',
        sk: 'trial-session|959c4338-0fac-42eb-b0eb-d53b8d0195cc',
        startDate: '2019-11-27T05:00:00.000Z',
        startTime: '10:00',
        swingSession: true,
        swingSessionId: '208a959f-9526-4db5-b262-e58c476a4604',
        term: 'Fall',
        termYear: '2019',
        trialLocation: 'Houston, Texas',
        trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
      });
    applicationContext
      .getPersistenceGateway()
      .putWorkItemInOutbox.mockImplementation(() => {});
  });

  it('should throw an Unauthorized error if the user role does not have the SERVE_DOCUMENT permission', async () => {
    // petitioner role does NOT have the SERVE_DOCUMENT permission
    const user = { ...mockUser, role: ROLES.petitioner };
    applicationContext.getCurrentUser.mockReturnValue(user);

    await expect(
      serveCourtIssuedDocumentInteractor({
        applicationContext,
        caseId: '000-00',
        documentId: '000',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw a Not Found error if the case can not be found', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(null);

    await expect(
      serveCourtIssuedDocumentInteractor({
        applicationContext,
        caseId: '000-00',
        documentId: '000',
      }),
    ).rejects.toThrow('Case 000-00 was not found');
  });

  it('should throw a Not Found error if the document can not be found', async () => {
    await expect(
      serveCourtIssuedDocumentInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentId: '000',
      }),
    ).rejects.toThrow('Document 000 was not found');
  });

  it('should set the document as served and update the case and work items for a generic order document', async () => {
    await serveCourtIssuedDocumentInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
    });

    const updatedCase = applicationContext.getPersistenceGateway().updateCase
      .mock.calls[0][0].caseToUpdate;
    const updatedDocument = updatedCase.documents.find(
      document =>
        document.documentId === 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
    );

    expect(updatedDocument.servedAt).toBeDefined();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().deleteWorkItemFromInbox,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().putWorkItemInOutbox,
    ).toHaveBeenCalled();
  });

  it('should set the number of pages present in the document to be served', async () => {
    await serveCourtIssuedDocumentInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentId: mockDocumentId,
    });

    const updatedCase = applicationContext.getPersistenceGateway().updateCase
      .mock.calls[0][0].caseToUpdate;
    const updatedDocument = updatedCase.documents.find(
      document => document.documentId === mockDocumentId,
    );

    expect(updatedDocument.numberOfPages).toBe(1);
    expect(
      applicationContext.getUseCaseHelpers().countPagesInDocument.mock
        .calls[0][0],
    ).toMatchObject({ documentId: mockDocumentId });
  });

  it('should set the document as served and update the case and work items for a non-generic order document', async () => {
    applicationContext
      .getPersistenceGateway()
      .saveDocumentFromLambda.mockImplementation(({ document: newPdfData }) => {
        fs.writeFileSync(
          testOutputPath + 'serveCourtIssuedDocumentInteractor_1.pdf',
          newPdfData,
        );
      });

    await serveCourtIssuedDocumentInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentId: mockDocumentId,
    });

    const updatedCase = applicationContext.getPersistenceGateway().updateCase
      .mock.calls[0][0].caseToUpdate;
    const updatedDocument = updatedCase.documents.find(
      document => document.documentId === mockDocumentId,
    );

    expect(updatedDocument.servedAt).toBeDefined();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().deleteWorkItemFromInbox,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().putWorkItemInOutbox,
    ).toHaveBeenCalled();
  });

  it('should call sendBulkTemplatedEmail, sending an email to all electronically-served parties, and should not return paperServicePdfData', async () => {
    const result = await serveCourtIssuedDocumentInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
    });

    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('should return paperServicePdfData when there are paper service parties on the case', async () => {
    const result = await serveCourtIssuedDocumentInteractor({
      applicationContext,
      caseId: 'd857e73a-636e-4aa7-9de2-b5cee8770ff0',
      documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
    });

    expect(result.pdfUrl).toBe(mockPdfUrl.url);
  });

  it('should remove the case from the trial session if the case has a trialSessionId', async () => {
    extendCase.trialSessionId = 'c54ba5a9-b37b-479d-9201-067ec6e335bb';

    await serveCourtIssuedDocumentInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentId: documentsWithCaseClosingEventCodes[0].documentId,
    });

    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
  });

  it('should remove the case from the trial session if the case has a trialSessionId', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
        caseOrder: [
          {
            caseId: '46c4064f-b44a-4ac3-9dfb-9ce9f00e43f5',
          },
        ],
        createdAt: '2019-10-27T05:00:00.000Z',
        gsi1pk: 'trial-session-catalog',
        isCalendared: false,
        judge: {
          name: 'Judge Armen',
          userId: 'dabbad00-18d0-43ec-bafb-654e83405416',
        },
        maxCases: 100,
        pk: 'trial-session|959c4338-0fac-42eb-b0eb-d53b8d0195cc',
        sessionType: 'Regular',
        sk: 'trial-session|959c4338-0fac-42eb-b0eb-d53b8d0195cc',
        startDate: '2019-11-27T05:00:00.000Z',
        startTime: '10:00',
        swingSession: true,
        swingSessionId: '208a959f-9526-4db5-b262-e58c476a4604',
        term: 'Fall',
        termYear: '2019',
        trialLocation: 'Houston, Texas',
        trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
      });

    extendCase.trialSessionId = 'c54ba5a9-b37b-479d-9201-067ec6e335bb';

    await serveCourtIssuedDocumentInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentId: documentsWithCaseClosingEventCodes[0].documentId,
    });

    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
  });

  documentsWithCaseClosingEventCodes.forEach(document => {
    it(`should set the case status to closed for event code: ${document.eventCode}`, async () => {
      await serveCourtIssuedDocumentInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentId: document.documentId,
      });

      const updatedCase = applicationContext.getPersistenceGateway().updateCase
        .mock.calls[0][0].caseToUpdate;

      expect(updatedCase.status).toEqual(CASE_STATUS_TYPES.closed);
      expect(
        applicationContext.getPersistenceGateway()
          .deleteCaseTrialSortMappingRecords,
      ).toHaveBeenCalled();
    });
  });
});
