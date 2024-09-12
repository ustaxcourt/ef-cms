import { TrialSessionsFilters } from '@web-client/presenter/state/trialSessionsPageState';
import { setTrialSessionsFiltersAction } from '@web-client/presenter/actions/TrialSession/setTrialSessionsFiltersAction';

export const setTrialSessionsFiltersSequence = [
  setTrialSessionsFiltersAction,
] as unknown as (props: Partial<TrialSessionsFilters>) => void;
