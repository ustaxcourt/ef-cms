import { resetTrialSessionsFiltersAction } from '@web-client/presenter/actions/TrialSession/resetTrialSessionsFiltersAction';

export const resetTrialSessionsFiltersSequence = [
  resetTrialSessionsFiltersAction,
] as unknown as (props?: ResetTrialSessionsFiltersSequence) => void;

export type ResetTrialSessionsFiltersSequence =
  | undefined
  | {
      currentTab: 'calendared' | 'new';
    };
