import { setDefaultMessagePageTableSortAction } from '../../actions/setDefaultMessagePageTableSortAction';

export const setDocketClerkReportMessagesTableSortSequence = [
  setDefaultMessagePageTableSortAction,
] as unknown as (props: { box?: string }) => void;
