import { runAction } from 'cerebral/test';
import { setStartInternalCaseTabAction } from './setStartInternalCaseTabAction';

describe('setStartInternalCaseTabAction', () => {
  it('should set currentViewMetadata.startCaseInternal tab from props', async () => {
    const result = await runAction(setStartInternalCaseTabAction, {
      props: { tab: 'caseInfo' },
    });

    expect(result.state.currentViewMetadata.startCaseInternal.tab).toEqual(
      'caseInfo',
    );
  });
});
