const {
  createCourtIssuedOrderPdfFromHtmlInteractor,
} = require('./createCourtIssuedOrderPdfFromHtmlInteractor');

const pageMock = {
  addStyleTag: () => {},
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
  font: () => {},
  puppeteer: {
    launch: () => browserMock,
  },
};
describe('createCourtIssuedOrderPdfFromHtmlInteractor', () => {
  it('returns the pdf result', async () => {
    const result = await createCourtIssuedOrderPdfFromHtmlInteractor({
      applicationContext: {
        getChromium: () => chromiumMock,
        logger: { error: () => {}, info: () => {} },
      },
      htmlString: 'Hello World from the use case',
    });

    expect(result).toEqual('Hello World');
  });
});
