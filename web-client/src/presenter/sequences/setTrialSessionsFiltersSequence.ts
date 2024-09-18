import { setTrialSessionsFiltersAction } from '@web-client/presenter/actions/TrialSession/setTrialSessionsFiltersAction';

export const setTrialSessionsFiltersSequence = [
  setTrialSessionsFiltersAction,
] as unknown as (props: {
  currentTab?: string;
  proceedingType?: string;
  sessionStatus?: string;
  judges?: { action: 'add' | 'remove'; judge: string };
}) => void;
