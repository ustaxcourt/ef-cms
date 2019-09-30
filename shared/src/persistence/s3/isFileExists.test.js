const { isFileExists } = require('./isFileExists');

describe('isFileExists', () => {
  const headObjectStub = jest
    .fn()
    .mockImplementationOnce(() => {
      return { promise: () => Promise.resolve('I found it!') };
    })
    .mockImplementation(() => {
      throw new Error('head request failed');
    });

  const applicationContext = {
    getDocumentsBucketName: () => 'my-test-bucket',
    getStorageClient: () => ({
      headObject: headObjectStub,
    }),
  };

  it('makes a head request to storage client to determine existence of a file', async () => {
    const result = await isFileExists({
      applicationContext,
      documentId: '867-5309',
    });
    expect(result).toEqual(true);
  });

  it('returns false if an error is thrown by headObject function', async () => {
    expect(
      await isFileExists({
        applicationContext,
        documentId: 'jenny-not-found',
      }),
    ).toBe(false);
  });
});
