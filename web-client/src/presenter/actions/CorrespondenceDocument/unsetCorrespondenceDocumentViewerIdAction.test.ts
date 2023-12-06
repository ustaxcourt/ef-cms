import { runAction } from '@web-client/presenter/test.cerebral';
import { unsetCorrespondenceDocumentViewerIdAction } from './unsetCorrespondenceDocumentViewerIdAction';

describe('unsetCorrespondenceDocumentViewerIdAction', () => {
  it('should unset the value of state.correspondenceId', async () => {
    const result = await runAction(unsetCorrespondenceDocumentViewerIdAction, {
      state: {
        correspondenceId: 'anything',
      },
    });

    expect(result.state.correspondenceId).toBeUndefined();
  });
});
