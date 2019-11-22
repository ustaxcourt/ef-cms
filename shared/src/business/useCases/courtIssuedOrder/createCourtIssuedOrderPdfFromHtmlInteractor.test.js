const {
  createCourtIssuedOrderPdfFromHtmlInteractor,
} = require('./createCourtIssuedOrderPdfFromHtmlInteractor');

const PDF_MOCK_BUFFER = 'Hello World';
const pageMock = {
  addStyleTag: () => {},
  pdf: () => {
    return PDF_MOCK_BUFFER;
  },
  setContent: () => {},
};

const chromiumBrowserMock = {
  close: () => {},
  newPage: () => pageMock,
};
describe('createCourtIssuedOrderPdfFromHtmlInteractor', () => {
  it('returns the pdf buffer produced by chromium', async () => {
    const result = await createCourtIssuedOrderPdfFromHtmlInteractor({
      applicationContext: {
        getChromiumBrowser: () => chromiumBrowserMock,
        logger: { error: () => {}, info: () => {} },
      },
      htmlString: 'Hello World from the use case',
    });

    expect(result).toEqual(PDF_MOCK_BUFFER);
  });
});
