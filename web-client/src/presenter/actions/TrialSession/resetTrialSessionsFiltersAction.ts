import { cloneDeep } from 'lodash';
import { initialTrialSessionPageState } from '@web-client/presenter/state/trialSessionsPageState';
import { state } from '@web-client/presenter/app.cerebral';

export const resetTrialSessionsFiltersAction = ({ store }: ActionProps) => {
  store.set(
    state.trialSessionsPage.filters,
    cloneDeep(initialTrialSessionPageState.filters),
  );
};
