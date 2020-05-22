const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  deleteCorrespondenceDocumentInteractor,
} = require('./deleteCorrespondenceDocumentInteractor');
const { User } = require('../../entities/User');

describe('deleteCorrespondenceDocumentInteractor', () => {
  let mockUser;

  beforeEach(() => {
    mockUser = {
      name: 'Docket Clerk',
      role: User.ROLES.docketClerk,
      userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
    };
    applicationContext.getCurrentUser.mockImplementation(() => mockUser);
  });

  it('should throw an Unauthorized error if the user role does not have the CASE_CORRESPONDENCE permission', async () => {
    const user = { ...mockUser, role: User.ROLES.petitioner };
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
      caseId: '111',
      documentIdToDelete: 'abc',
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
      caseId: '111',
      documentIdToDelete: 'abc',
    });

    expect(
      applicationContext.getPersistenceGateway().deleteCaseCorrespondence.mock
        .calls[0][0],
    ).toMatchObject({
      caseId: '111',
      documentIdToDelete: 'abc',
    });
  });
});
