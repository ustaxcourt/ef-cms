import { setCurrentPaginationPageAction } from '../actions/setCurrentPaginationPageAction';

export const setCurrentPaginationPageSequence = [
  setCurrentPaginationPageAction,
] as unknown as (props: {
  currentPaginationPage: number;
  advancedSearchTab: string;
}) => void;
