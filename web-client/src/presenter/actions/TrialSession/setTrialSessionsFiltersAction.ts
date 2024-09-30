import { TrialSessionsFilters } from '@web-client/presenter/state/trialSessionsPageState';
import { state } from '@web-client/presenter/app.cerebral';

export const setTrialSessionsFiltersAction = ({
  props,
  store,
}: ActionProps<Partial<TrialSessionsFilters>>) => {
  if (props.currentTab) {
    store.set(state.trialSessionsPage.filters.currentTab, props.currentTab);
  }

  if (props.judgeId) {
    store.set(state.trialSessionsPage.filters.judgeId, props.judgeId);
  }

  if (props.proceedingType) {
    store.set(
      state.trialSessionsPage.filters.proceedingType,
      props.proceedingType,
    );
  }

  if (props.sessionStatus) {
    store.set(
      state.trialSessionsPage.filters.sessionStatus,
      props.sessionStatus,
    );
  }

  if (props.sessionType) {
    store.set(state.trialSessionsPage.filters.sessionType, props.sessionType);
  }

  if (props.trialLocation) {
    store.set(
      state.trialSessionsPage.filters.trialLocation,
      props.trialLocation,
    );
  }
};
