import { runAction } from 'cerebral/test';
import { setTitleForGlobalReportFactoryAction } from './setTitleForGlobalReportFactoryAction';

describe('setTitleForGlobalReportFactoryAction', () => {
  it('sets headerTitle to state.screenMetadata.headerTitle in state', async () => {
    const headerTitle = 'Pending Report';
    const { state } = await runAction(
      setTitleForGlobalReportFactoryAction(headerTitle),
      {},
    );
    expect(state.screenMetadata.headerTitle).toEqual(headerTitle);
  });
});
