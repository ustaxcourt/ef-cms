import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setDocumentTitleFromFreeTextAction } from './setDocumentTitleFromFreeTextAction';

describe('setDocumentTitleFromFreeTextAction', () => {
  it('should update the forms document title', async () => {
    const results = await runAction(setDocumentTitleFromFreeTextAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          freeText: 'something',
        },
      },
    });

    expect(results.state.form.documentTitle).toEqual('something');
  });
});
