import { ResetTrialSessionsFiltersSequence } from '@web-client/presenter/sequences/resetTrialSessionsFiltersSequence';
import { cloneDeep } from 'lodash';
import { initialTrialSessionPageState } from '@web-client/presenter/state/trialSessionsPageState';
import { state } from '@web-client/presenter/app.cerebral';

export const resetTrialSessionsFiltersAction = ({
  props,
  store,
}: ActionProps<ResetTrialSessionsFiltersSequence>) => {
  store.set(
    state.trialSessionsPage.filters,
    cloneDeep(initialTrialSessionPageState.filters),
  );
  if (props?.currentTab) {
    store.set(state.trialSessionsPage.filters.currentTab, props.currentTab);
  }
};
