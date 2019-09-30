const {
  uploadOrderDocumentInteractor,
} = require('./uploadOrderDocumentInteractor');
const { UnauthorizedError } = require('../../../errors/errors');

describe('uploadOrderDocumentInteractor', () => {
  let applicationContext;

  it('throws an error when an unauthorized user tries to access the use case', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return {
          role: 'admin',
          userId: 'admin',
        };
      },
    };
    let error;
    try {
      await uploadOrderDocumentInteractor({
        applicationContext,
        documentFile: '',
        documentIdToOverwrite: 123,
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(UnauthorizedError);
  });

  it('uploads documents on behalf of authorized users', async () => {
    const uploadMock = jest.fn().mockReturnValue(Promise.resolve('woo'));
    applicationContext = {
      getCurrentUser: () => {
        return {
          role: 'docketclerk',
          userId: 'admin',
        };
      },
      getPersistenceGateway: () => {
        return { uploadDocument: uploadMock };
      },
    };

    await uploadOrderDocumentInteractor({
      applicationContext,
      documentFile: '',
      documentIdToOverwrite: 123,
    });

    expect(uploadMock.mock.calls.length).toBe(1);
  });
});
