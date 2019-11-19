import { serveCourtIssuedDocumentInteractor } from './serveCourtIssuedDocumentInteractor';
const { createISODateString } = require('../utilities/DateHandler');
const { User } = require('../entities/User');

describe('serveCourtIssuedDocumentInteractor', () => {
  let applicationContext;
  let updateCaseMock;
  let sendBulkTemplatedEmailMock;

  const mockUser = {
    role: User.ROLES.docketClerk,
    userId: '123',
  };
  const mockCases = [
    {
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      docketNumber: '123-45',
      docketRecord: [
        {
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
          filingDate: createISODateString(),
        },
      ],
      documents: [
        {
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
          documentType: 'Order',
          userId: '123',
        },
      ],
    },
  ];

  beforeEach(() => {
    updateCaseMock = jest.fn(({ caseToUpdate }) => caseToUpdate);
    sendBulkTemplatedEmailMock = jest.fn();

    applicationContext = {
      getCurrentUser: () => mockUser,
      getDispatchers: () => ({
        sendBulkTemplatedEmail: sendBulkTemplatedEmailMock,
      }),
      getPersistenceGateway: () => ({
        getCaseByCaseId: ({ caseId }) => {
          return mockCases.find(mockCase => mockCase.caseId === caseId);
        },
        updateCase: updateCaseMock,
      }),
    };
  });

  it('should throw an Unathorized error if the user role does not have the SERVE_DOCUMENT permission', async () => {
    let error;

    // peitioner role does NOT have the SERVE_DOCUMENT permission
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
    await serveCourtIssuedDocumentInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
    });

    expect(sendBulkTemplatedEmailMock).toHaveBeenCalled();
  });
});
