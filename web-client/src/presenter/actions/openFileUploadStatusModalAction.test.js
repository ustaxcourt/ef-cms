import { openFileUploadStatusModalAction } from './openFileUploadStatusModalAction';
import { runAction } from 'cerebral/test';

describe('openFileUploadStatusModalAction', () => {
  it('sets state.modal.showModal to FileUploadStatusModal', async () => {
    const { state } = await runAction(openFileUploadStatusModalAction, {
      state: {},
    });

    expect(state.modal.showModal).toEqual('FileUploadStatusModal');
  });
});
