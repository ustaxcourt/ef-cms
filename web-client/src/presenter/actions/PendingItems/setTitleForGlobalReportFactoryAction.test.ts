import { runAction } from '@web-client/presenter/test.cerebral';
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
