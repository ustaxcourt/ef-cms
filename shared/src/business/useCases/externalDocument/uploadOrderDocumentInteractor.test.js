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
    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(UnauthorizedError);
  });
});
