import { setTodaysOrdersCurrentPaginationPageAction } from '../../actions/Public/setTodaysOrdersCurrentPaginationPageAction';

export const setTodaysOrdersCurrentPaginationPageSequence = [
  setTodaysOrdersCurrentPaginationPageAction,
] as unknown as (props: { currentPaginationPage: number }) => void;
