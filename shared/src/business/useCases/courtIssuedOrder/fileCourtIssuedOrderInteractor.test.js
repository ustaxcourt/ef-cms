const {
  fileCourtIssuedOrderInteractor,
} = require('./fileCourtIssuedOrderInteractor');
const { User } = require('../../entities/User');

describe('fileCourtIssuedOrderInteractor', () => {
  let caseRecord = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    createdAt: '',
    docketNumber: '45678-18',
    documents: [
      {
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentType: 'Answer',
        userId: 'respondent',
      },
      {
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentType: 'Answer',
        userId: 'respondent',
      },
      {
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentType: 'Answer',
        userId: 'respondent',
      },
    ],
    role: User.ROLES.petitioner,
    userId: 'petitioner',
  };

  let applicationContext;
  let currentUser;
  let getCaseByCaseIdSpy = jest.fn().mockResolvedValue(caseRecord);
  let updateCaseSpy = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    currentUser = new User({
      name: 'Olivia Jade',
      role: User.ROLES.petitionsClerk,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => currentUser,
      getPersistenceGateway: () => ({
        getCaseByCaseId: getCaseByCaseIdSpy,
        getUserById: async () => currentUser,
        updateCase: updateCaseSpy,
      }),
    };
  });

  it('should throw an error if not authorized', async () => {
    currentUser = {
      name: 'Olivia Jade',
      role: User.ROLES.practitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };
    await expect(
      fileCourtIssuedOrderInteractor({
        applicationContext,
        documentMetadata: {
          caseId: caseRecord.caseId,
          documentType: 'Order to Show Cause',
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should add order document to case', async () => {
    await fileCourtIssuedOrderInteractor({
      applicationContext,
      documentMetadata: {
        caseId: caseRecord.caseId,
        documentType: 'Order to Show Cause',
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    expect(getCaseByCaseIdSpy).toHaveBeenCalled();
    expect(
      updateCaseSpy.mock.calls[0][0].caseToUpdate.documents.length,
    ).toEqual(4);
  });

  it('should add order document to case and set freeText to the document title if it is a generic order (eventCode O)', async () => {
    await fileCourtIssuedOrderInteractor({
      applicationContext,
      documentMetadata: {
        caseId: caseRecord.caseId,
        documentTitle: 'Order to do anything',
        documentType: 'Order',
        eventCode: 'O',
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    expect(getCaseByCaseIdSpy).toHaveBeenCalled();
    expect(
      updateCaseSpy.mock.calls[0][0].caseToUpdate.documents.length,
    ).toEqual(4);
    expect(
      updateCaseSpy.mock.calls[0][0].caseToUpdate.documents[3],
    ).toMatchObject({ freeText: 'Order to do anything' });
  });

  it('should add a generic notice document to case, set freeText to the document title, and set the document to signed', async () => {
    await fileCourtIssuedOrderInteractor({
      applicationContext,
      documentMetadata: {
        caseId: caseRecord.caseId,
        documentTitle: 'Notice to be nice',
        documentType: 'Notice',
        eventCode: 'NOT',
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    expect(getCaseByCaseIdSpy).toHaveBeenCalled();
    expect(
      updateCaseSpy.mock.calls[0][0].caseToUpdate.documents.length,
    ).toEqual(4);
    expect(
      updateCaseSpy.mock.calls[0][0].caseToUpdate.documents[3],
    ).toMatchObject({ freeText: 'Notice to be nice' });
  });
});
