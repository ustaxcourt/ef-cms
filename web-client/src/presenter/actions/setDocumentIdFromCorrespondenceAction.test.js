import { runAction } from 'cerebral/test';
import { setDocumentIdFromCorrespondenceAction } from './setDocumentIdFromCorrespondenceAction';

describe('setDocumentIdFromCorrespondenceAction', () => {
  it('sets state.docketEntryId from props', async () => {
    const { state } = await runAction(setDocumentIdFromCorrespondenceAction, {
      props: {
        correspondenceId: '1234',
      },
    });

    expect(state.docketEntryId).toEqual('1234');
  });
});
