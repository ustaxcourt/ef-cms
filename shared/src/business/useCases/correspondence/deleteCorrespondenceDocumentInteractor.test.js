const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  deleteCorrespondenceDocumentInteractor,
} = require('./deleteCorrespondenceDocumentInteractor');
const { ROLES } = require('../../entities/EntityConstants');

describe('deleteCorrespondenceDocumentInteractor', () => {
  let mockUser;

  beforeEach(() => {
    mockUser = {
      name: 'Docket Clerk',
      role: ROLES.docketClerk,
      userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
    };
    applicationContext.getCurrentUser.mockImplementation(() => mockUser);
  });

  it('should throw an Unauthorized error if the user role does not have the CASE_CORRESPONDENCE permission', async () => {
    const user = { ...mockUser, role: ROLES.petitioner };
    applicationContext.getCurrentUser.mockReturnValue(user);

    await expect(
      deleteCorrespondenceDocumentInteractor({
        applicationContext,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should delete the specified correspondence document from s3', async () => {
    await deleteCorrespondenceDocumentInteractor({
      applicationContext,
      docketNumber: '101-20',
      documentId: 'abc',
    });

    expect(
      applicationContext.getPersistenceGateway().deleteDocument.mock
        .calls[0][0],
    ).toMatchObject({
      key: 'abc',
    });
  });

  it('should delete the specified correspondence document from the case', async () => {
    await deleteCorrespondenceDocumentInteractor({
      applicationContext,
      docketNumber: '101-20',
      documentId: 'abc',
    });

    expect(
      applicationContext.getPersistenceGateway().deleteCaseCorrespondence.mock
        .calls[0][0],
    ).toMatchObject({
      docketNumber: '101-20',
      documentId: 'abc',
    });
  });
});
