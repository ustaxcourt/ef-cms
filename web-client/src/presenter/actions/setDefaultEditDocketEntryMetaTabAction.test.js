import { runAction } from 'cerebral/test';
import { setDefaultEditDocketEntryMetaTabAction } from './setDefaultEditDocketEntryMetaTabAction';

describe('setDefaultEditDocketEntryMetaTabAction', () => {
  it('sets default edit docket entry meta tab', async () => {
    const result = await runAction(setDefaultEditDocketEntryMetaTabAction, {
      state: {
        editDocketEntryMetaTab: 'actions',
      },
    });

    expect(result.state.editDocketEntryMetaTab).toEqual('documentInfo');
  });
});
