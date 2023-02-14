import { runAction } from 'cerebral/test';
import { setDocketEntryIdFromCorrespondenceAction } from './setDocketEntryIdFromCorrespondenceAction';

describe('setDocketEntryIdFromCorrespondenceAction', () => {
  it('sets state.docketEntryId from props', async () => {
    const { state } = await runAction(
      setDocketEntryIdFromCorrespondenceAction,
      {
        props: {
          correspondenceId: '1234',
        },
      },
    );

    expect(state.docketEntryId).toEqual('1234');
  });
});
