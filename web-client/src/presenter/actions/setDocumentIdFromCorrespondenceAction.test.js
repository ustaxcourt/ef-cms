import { runAction } from 'cerebral/test';
import { setDocumentIdFromCorrespondenceAction } from './setDocumentIdFromCorrespondenceAction';

describe('setDocumentIdFromCorrespondenceAction', () => {
  it('sets state.documentId from props', async () => {
    const { state } = await runAction(setDocumentIdFromCorrespondenceAction, {
      props: {
        correspondenceId: '1234',
      },
    });

    expect(state.documentId).toEqual('1234');
  });
});
