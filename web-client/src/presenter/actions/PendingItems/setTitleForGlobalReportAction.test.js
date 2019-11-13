import { runAction } from 'cerebral/test';
import { setTitleForGlobalReportAction } from './setTitleForGlobalReportAction';

describe('setTitleForGlobalReportAction', () => {
  it('sets state.pendingItems to the passed in props.pendingItems', async () => {
    const { state } = await runAction(setTitleForGlobalReportAction, {});
    expect(state.screenMetadata.headerTitle).toEqual('Pending Report');
  });
});
