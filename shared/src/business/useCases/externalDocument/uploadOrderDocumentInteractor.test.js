const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  uploadOrderDocumentInteractor,
} = require('./uploadOrderDocumentInteractor');
const { ROLES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');

describe('uploadOrderDocumentInteractor', () => {
  it('throws an error when an unauthorized user tries to access the use case', async () => {
    await expect(
      uploadOrderDocumentInteractor({
        applicationContext,
        docketEntryIdToOverwrite: 123,
        documentFile: '',
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('uploads documents on behalf of authorized users', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'admin',
    });

    await uploadOrderDocumentInteractor({
      applicationContext,
      docketEntryIdToOverwrite: 123,
      documentFile: '',
    });

    expect(
      applicationContext.getPersistenceGateway().uploadDocumentFromClient.mock
        .calls.length,
    ).toBe(1);
  });
});
