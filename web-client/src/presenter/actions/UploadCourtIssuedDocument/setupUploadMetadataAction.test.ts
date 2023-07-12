import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setupUploadMetadataAction } from './setupUploadMetadataAction';

describe('setupUploadMetadataAction', () => {
  it('should update the forms document title', async () => {
    const results = await runAction(setupUploadMetadataAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          generatedDocumentTitle: 'something',
        },
      },
    });

    expect(results.state.form.documentTitle).toEqual('something');
  });
});
