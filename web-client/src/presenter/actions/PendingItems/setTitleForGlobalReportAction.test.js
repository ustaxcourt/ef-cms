import { runAction } from 'cerebral/test';
import { setTitleForGlobalReportAction } from './setTitleForGlobalReportAction';

describe('setTitleForGlobalReportAction', () => {
  it('sets headerTitle to state.screenMetadata.headerTitle in state', async () => {
    const headerTitle = 'Pending Report';
    const { state } = await runAction(
      setTitleForGlobalReportAction(headerTitle),
      {},
    );
    expect(state.screenMetadata.headerTitle).toEqual(headerTitle);
  });
});
