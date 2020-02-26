import { runAction } from 'cerebral/test';
import { setStartInternalCaseTabAction } from './setStartInternalCaseTabAction';

describe('setStartInternalCaseTabAction', () => {
  it('should set startInternalCase tab from props', async () => {
    const result = await runAction(setStartInternalCaseTabAction, {
      props: { tab: 'caseInfo' },
    });

    expect(result.state.startInternalCase.tab).toEqual('caseInfo');
  });
});
