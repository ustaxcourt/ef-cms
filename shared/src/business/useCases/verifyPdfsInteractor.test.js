const {
  applicationContext,
  testPdfDoc,
} = require('../test/createTestApplicationContext');
const { verifyPdfsInteractor } = require('./verifyPdfsInteractor');

beforeAll(() => {
  jest.setTimeout(30000);

  applicationContext.getStorageClient().getObject.mockReturnValue({
    promise: async () => ({
      Body: testPdfDoc,
    }),
  });
});

describe('verifyPdfsInteractor', () => {
  it('should not throw an error when PDF pages can be loaded', () => {
    expect(
      verifyPdfsInteractor({
        applicationContext,
        testPdfDoc,
      }),
    ).not.toThrow();
  });
});
