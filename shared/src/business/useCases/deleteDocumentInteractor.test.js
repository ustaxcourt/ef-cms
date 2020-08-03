const { applicationContext } = require('../test/createTestApplicationContext');
const { deleteDocumentInteractor } = require('./deleteDocumentInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { ROLES } = require('../entities/EntityConstants');

describe('deleteDocumentInteractor', () => {
  const documentToDeleteId = 'a54ba5a9-b37b-479d-9201-067ec6e335bb';
  const docketNumber = '999-99';

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({ ...MOCK_CASE, docketNumber });
  });

  it('should return an unauthorized error on non internal users', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
    });

    await expect(
      deleteDocumentInteractor({
        applicationContext,
        docketNumber,
        documentId: documentToDeleteId,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should make a call to retrieve the case associated with the passed in docketNumber', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
    });

    await deleteDocumentInteractor({
      applicationContext,
      docketNumber,
      documentId: documentToDeleteId,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls[0][0],
    ).toMatchObject({ docketNumber });
  });

  it('should delete the specified draft document', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
    });

    await deleteDocumentInteractor({
      applicationContext,
      docketNumber,
      documentId: documentToDeleteId,
    });

    expect(
      applicationContext.getPersistenceGateway().deleteDocument.mock
        .calls[0][0],
    ).toMatchObject({ docketNumber, documentId: documentToDeleteId });
    expect(
      applicationContext.getPersistenceGateway().deleteDocumentFromS3.mock
        .calls[0][0],
    ).toMatchObject({ key: documentToDeleteId });
  });

  it('should update the case entity after deleting the specified document', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
    });

    await deleteDocumentInteractor({
      applicationContext,
      docketNumber,
      documentId: documentToDeleteId,
    });

    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
  });
});
