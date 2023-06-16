import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDocumentTitleFromFreeTextAction } from './setDocumentTitleFromFreeTextAction';

describe('setDocumentTitleFromFreeTextAction', () => {
  it('should update the forms document title', async () => {
    const results = await runAction(setDocumentTitleFromFreeTextAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          freeText: 'Order',
        },
      },
    });

    expect(results.state.form.documentTitle).toEqual('Order');
  });
});
