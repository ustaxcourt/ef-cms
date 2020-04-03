import { runAction } from 'cerebral/test';
import { setStartInternalCaseDefaultTabAction } from './setStartInternalCaseDefaultTabAction';

describe('setStartInternalCaseDefaultTabAction', () => {
  it('should set startInternalCase tab to partyInfo by default', async () => {
    const result = await runAction(setStartInternalCaseDefaultTabAction, {});

    expect(result.state.startCaseInternal.tab).toEqual('partyInfo');
  });
});
