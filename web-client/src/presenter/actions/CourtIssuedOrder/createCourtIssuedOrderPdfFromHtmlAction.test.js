import { createCourtIssuedOrderPdfFromHtmlAction } from './createCourtIssuedOrderPdfFromHtmlAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = {
  getUseCases: () => ({
    createCourtIssuedOrderPdfFromHtml: () =>
      '<i>hello from create court issued order pdf from html</i>',
  }),
};

describe('createCourtIssuedOrderPdfFromHtmlAction', () => {
  it('calls createCourtIssuedOrderPdfFromHtml use case and return pdf url', async () => {
    const result = await runAction(createCourtIssuedOrderPdfFromHtmlAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          richText: '<i>hello from create court issued order pdf from html</i>',
        },
      },
    });
    expect(result.output.pdfUrl).toBeTruthy();
  });
});
