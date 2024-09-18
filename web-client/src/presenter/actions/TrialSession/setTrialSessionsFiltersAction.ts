import {
  TrialSessionProceedingType,
  TrialSessionTypes,
} from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export type SetTrialSessionsFilters = Partial<{
  currentTab: 'calendared' | 'new';
  judges: {
    action: 'add' | 'remove';
    judge: { name: string; userId: string };
  };
  proceedingType: TrialSessionProceedingType | 'All';
  sessionStatus: string;
  sessionTypes: { action: 'add' | 'remove'; sessionType: TrialSessionTypes };
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
    const { action, judge } = props.judges;
    if (action === 'add') {
      currentFilters.judges[judge.userId] = judge;
    } else {
      delete currentFilters.judges[judge.userId];
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

  if (props.sessionTypes) {
    const { action, sessionType } = props.sessionTypes;
    if (action === 'add') {
      currentFilters.sessionTypes[sessionType] = sessionType;
    } else {
      delete currentFilters.sessionTypes[sessionType];
    }

    store.set(
      state.trialSessionsPage.filters.sessionTypes,
      currentFilters.sessionTypes,
    );
  }

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
