import { createCourtIssuedOrderPdfFromHtmlAction } from './createCourtIssuedOrderPdfFromHtmlAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = {
  getUseCases: () => ({
    createCourtIssuedOrderPdfFromHtml: () =>
      'hello from create court issued order pdf from html',
  }),
};

describe('createCourtIssuedOrderPdfFromHtmlAction', () => {
  it('updates createCourtIssuedOrderPdfFromHtml', async () => {
    const result = await runAction(createCourtIssuedOrderPdfFromHtmlAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          richText: 'hello from create court issued order pdf from html',
        },
      },
    });
    expect(result).toEqual(
      'hello from create court issued order pdf from html',
    );
  });
});
