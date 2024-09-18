import { state } from '@web-client/presenter/app.cerebral';

export const setTrialSessionsFiltersAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const currentFilters = get(state.trialSessionsPage.filters);

  if (props.currentTab) {
    store.set(state.trialSessionsPage.filters.currentTab, props.currentTab);
  }
  // Update for Trial Sessions Page
  if (props.judges) {
    if (
      props.judges.action === 'add' &&
      !currentFilters.judges.includes(props.judges.judge)
    ) {
      currentFilters.judges.push(props.judges.judge);
      store.merge(state.trialSessionsPage.filters, currentFilters);
    } else if (props.judges.action === 'remove') {
      const foundIndex = currentFilters.judges.findIndex(
        caseType => caseType === props.judges!.judge,
      );
      currentFilters.judges.splice(foundIndex, 1);
      store.merge(state.trialSessionsPage.filters, currentFilters);
    }
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
  // Update for Trial Sessions Page
  if (props.sessionType) {
    store.set(state.trialSessionsPage.filters.sessionType, props.sessionType);
  }
  // Update for Trial Sessions Page
  if (props.trialLocation) {
    store.set(
      state.trialSessionsPage.filters.trialLocation,
      props.trialLocation,
    );
  }
};
