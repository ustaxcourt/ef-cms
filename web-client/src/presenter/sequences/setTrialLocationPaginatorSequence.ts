import { setTrialLocationPaginationAction } from '@web-client/presenter/actions/TrialSession/setTrialLocationPaginationAction';

export const setTrialLocationPaginatorSequence = [
  setTrialLocationPaginationAction,
] as unknown as (props: { pageNumber: number; pageType: string }) => void;
