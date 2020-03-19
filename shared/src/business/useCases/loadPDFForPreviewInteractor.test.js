const {
  loadPDFForPreviewInteractor,
} = require('./loadPDFForPreviewInteractor');

const getDocumentMock = jest.fn().mockResolvedValue('pdf data');

describe('loadPDFForPreviewInteractor', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fetches document from persistence', async () => {
    const result = await loadPDFForPreviewInteractor({
      applicationContext: {
        getPersistenceGateway: () => ({
          getDocument: getDocumentMock,
        }),
      },
    });

    expect(result).toEqual('pdf data');
  });

  it('should throw an error if getDocument returns an error', async () => {
    let error;
    try {
      await loadPDFForPreviewInteractor({
        applicationContext: {
          getPersistenceGateway: () => ({
            getDocument: jest
              .fn()
              .mockRejectedValue(
                new Error(
                  'some internal exception message that will not be seen',
                ),
              ),
          }),
        },
      });
    } catch (err) {
      error = err;
    }

    expect(error).toEqual(new Error('error loading PDF'));
  });
});
