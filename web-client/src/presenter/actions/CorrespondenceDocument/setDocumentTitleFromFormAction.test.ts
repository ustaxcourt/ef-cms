import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setDocumentTitleFromFormAction } from './setDocumentTitleFromFormAction';

describe('setDocumentTitleFromFormAction', () => {
  it('should update the forms document title', async () => {
    const results = await runAction(setDocumentTitleFromFormAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          documentTitle: 'something',
        },
      },
    });

    expect(results.state.form.documentTitle).toEqual('something');
  });
});
