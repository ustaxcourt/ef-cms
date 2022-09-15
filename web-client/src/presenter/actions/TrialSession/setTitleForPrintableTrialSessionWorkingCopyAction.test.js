import { runAction } from 'cerebral/test';
import { setTitleForPrintableTrialSessionWorkingCopyAction } from './setTitleForPrintableTrialSessionWorkingCopyAction';

describe('setTitleForPrintableTrialSessionWorkingCopyAction', () => {
  const headerTitle = 'Trial Session Printable Working Copy';
  it(`sets state.screenMetadata.headerTitle to ${headerTitle}`, async () => {
    const { state } = await runAction(
      setTitleForPrintableTrialSessionWorkingCopyAction,
      {},
    );
    expect(state.screenMetadata.headerTitle).toEqual(headerTitle);
  });
});
