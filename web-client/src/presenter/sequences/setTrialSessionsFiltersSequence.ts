import {
  SetTrialSessionsFilters,
  setTrialSessionsFiltersAction,
} from '@web-client/presenter/actions/TrialSession/setTrialSessionsFiltersAction';

export const setTrialSessionsFiltersSequence = [
  setTrialSessionsFiltersAction,
] as unknown as (props: SetTrialSessionsFilters) => void;
