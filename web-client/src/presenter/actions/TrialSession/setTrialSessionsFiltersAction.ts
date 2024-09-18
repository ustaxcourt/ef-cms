import { TrialSessionProceedingType } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export type SetTrialSessionsFilters = Partial<{
  currentTab: 'calendared' | 'new';
  judges: {
    action: 'add' | 'remove';
    judge: { name: string; userId: string };
  };
  proceedingType: TrialSessionProceedingType | 'All';
  sessionStatus: string;
  sessionType: string;
  trialLocations: {
    action: 'add' | 'remove';
    trialLocation: string;
  };
}>;

export const setTrialSessionsFiltersAction = ({
  get,
  props,
  store,
}: ActionProps<SetTrialSessionsFilters>) => {
  const currentFilters = get(state.trialSessionsPage.filters);

  if (props.currentTab) {
    store.set(state.trialSessionsPage.filters.currentTab, props.currentTab);
  }

  if (props.judges) {
    if (props.judges.action === 'add') {
      currentFilters.judges[props.judges.judge.userId] = props.judges.judge;
    } else {
      delete currentFilters.judges[props.judges.judge.userId];
    }

    store.set(state.trialSessionsPage.filters.judges, currentFilters.judges);
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
  if (props.trialLocations) {
    const { action, trialLocation } = props.trialLocations;
    if (action === 'add') {
      currentFilters.trialLocations[trialLocation] = trialLocation;
    } else {
      delete currentFilters.trialLocations[trialLocation];
    }

    store.set(
      state.trialSessionsPage.filters.trialLocations,
      currentFilters.trialLocations,
    );
  }
};
