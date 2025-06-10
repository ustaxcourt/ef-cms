import { setCurrentTabAction } from '@web-client/presenter/actions/TrialSession/setCurrentTabAction';

export const setCurrentTabSequence = [
  setCurrentTabAction,
] as unknown as (props: { currentTab: string }) => void;
