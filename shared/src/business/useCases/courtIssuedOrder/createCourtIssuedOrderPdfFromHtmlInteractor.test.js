const {
  createCourtIssuedOrderPdfFromHtml,
} = require('./createCourtIssuedOrderPdfFromHtmlInteractor');

describe('createCourtIssuedOrderPdfFromHtml', () => {
  it('returns the htmlString back', () => {
    const result = createCourtIssuedOrderPdfFromHtml({
      applicationContext: {},
      htmlString: 'Hello World',
    });

    expect(result).toEqual('Hello World');
  });
});
