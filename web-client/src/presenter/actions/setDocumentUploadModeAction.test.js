import { runAction } from 'cerebral/test';
import { setDocumentUploadModeAction } from './setDocumentUploadModeAction';

describe('setDocumentUploadModeAction', () => {
  it('sets state.documentUploadMode to the passed in props.documentUploadMode', async () => {
    const result = await runAction(setDocumentUploadModeAction, {
      props: {
        documentUploadMode: 'something',
      },
    });
    expect(result.state.documentUploadMode).toEqual('something');
  });
});
