import { runAction } from '@web-client/presenter/test.cerebral';
import { setSaveAlertsForNavigationAction } from './setSaveAlertsForNavigationAction';

describe('setSaveAlertsForNavigationAction', () => {
  it('sets state.saveAlertsForNavigation to true', async () => {
    const { state } = await runAction(setSaveAlertsForNavigationAction, {
      state: { saveAlertsForNavigation: false },
    });

    expect(state.saveAlertsForNavigation).toBeTruthy();
  });
});
