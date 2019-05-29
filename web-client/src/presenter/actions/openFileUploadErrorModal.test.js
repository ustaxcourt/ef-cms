import { openFileUploadErrorModal } from './openFileUploadErrorModal';
import { runAction } from 'cerebral/test';

describe('openFileUploadErrorModal', () => {
  it('sets state.showModal to FileUploadErrorModal', async () => {
    const result = await runAction(openFileUploadErrorModal);

    expect(result.state.showModal).toEqual('FileUploadErrorModal');
  });
});
