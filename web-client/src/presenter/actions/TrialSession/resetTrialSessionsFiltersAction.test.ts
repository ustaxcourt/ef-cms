import { SESSION_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { initialTrialSessionPageState } from '@web-client/presenter/state/trialSessionsPageState';
import { resetTrialSessionsFiltersAction } from '@web-client/presenter/actions/TrialSession/resetTrialSessionsFiltersAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('resetTrialSessionsFiltersAction', () => {
  it('should reset the trialSessions filters', async () => {
    const result = await runAction(resetTrialSessionsFiltersAction, {
      state: { trialSessionsPage: { filters: { currentTab: 'new' } } },
    });

    expect(result.state.trialSessionsPage.filters).toEqual(
      initialTrialSessionPageState.filters,
    );
  });
  it('should set allow the current tab to be preserved when resetting filters', async () => {
    const result = await runAction(resetTrialSessionsFiltersAction, {
      props: { currentTab: 'new' },
    });
    expect(result.state.trialSessionsPage.filters.currentTab).toEqual('new');
  });

  it('should not reset filters when the user is already on the selected tab', async () => {
    const result = await runAction(resetTrialSessionsFiltersAction, {
      props: { currentTab: 'new' },
      state: {
        trialSessionsPage: {
          filters: {
            currentTab: 'new',
            sessionStatus: SESSION_STATUS_TYPES.closed,
          },
        },
      },
    });
    expect(result.state.trialSessionsPage.filters.currentTab).toEqual('new');
    expect(result.state.trialSessionsPage.filters.sessionStatus).toEqual(
      SESSION_STATUS_TYPES.closed,
    );
  });
});
