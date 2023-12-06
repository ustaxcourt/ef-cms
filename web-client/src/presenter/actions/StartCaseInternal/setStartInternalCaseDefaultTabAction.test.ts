import { runAction } from '@web-client/presenter/test.cerebral';
import { setStartInternalCaseDefaultTabAction } from './setStartInternalCaseDefaultTabAction';

describe('setStartInternalCaseDefaultTabAction', () => {
  it('should set currentViewMetadata.startCaseInternal tab to partyInfo by default', async () => {
    const result = await runAction(setStartInternalCaseDefaultTabAction, {});

    expect(result.state.currentViewMetadata.startCaseInternal.tab).toEqual(
      'partyInfo',
    );
  });
});
