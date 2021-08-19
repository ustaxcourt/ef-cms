const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  uploadCorrespondenceDocumentInteractor,
} = require('./uploadCorrespondenceDocumentInteractor');
const { ROLES } = require('../../entities/EntityConstants');

describe('uploadCorrespondenceDocumentInteractor', () => {
  let mockUser;
  const mockKey = 'cf105788-5d34-4451-aa8d-dfd9a851b675';
  const mockDocumentFile = 'bananas';
  const mockUserFixture = {
    name: 'Docket Clerk',
    role: ROLES.docketClerk,
    userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
  };

  beforeEach(() => {
    mockUser = mockUserFixture;
    applicationContext.getCurrentUser.mockImplementation(() => mockUser);
  });

  it('should throw an Unauthorized error if the user role does not have the CASE_CORRESPONDENCE permission', async () => {
    mockUser = { ...mockUser, role: ROLES.petitioner };

    await expect(
      uploadCorrespondenceDocumentInteractor(applicationContext, {}),
    ).rejects.toThrow('Unauthorized');
  });

  it('should upload the document file to the specified correspondence document', async () => {
    await uploadCorrespondenceDocumentInteractor(applicationContext, {
      documentFile: mockDocumentFile,
      keyToOverwrite: mockKey,
    });

    expect(
      applicationContext.getPersistenceGateway().uploadDocumentFromClient.mock
        .calls[0][0],
    ).toMatchObject({
      applicationContext,
      document: mockDocumentFile,
      key: mockKey,
    });
  });
});
