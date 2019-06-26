const {
  createCourtIssuedOrderPdfFromHtml,
} = require('./createCourtIssuedOrderPdfFromHtmlInteractor');

const pageMock = {
  pdf: () => {
    return 'Hello World';
  },
  setContent: () => {},
};

const browserMock = {
  close: () => {},
  newPage: () => pageMock,
};

const chromiumMock = {
  puppeteer: {
    launch: () => browserMock,
  },
};
describe('createCourtIssuedOrderPdfFromHtml', () => {
  it('returns the pdf result', async () => {
    const result = await createCourtIssuedOrderPdfFromHtml({
      applicationContext: {
        getChromium: () => chromiumMock,
      },
      htmlString: 'Hello World from the use case',
    });

    expect(result).toEqual('Hello World');
  });
});
