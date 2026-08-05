import { setDocketClerkReportMessagesTableSortAction } from '../../actions/DocketClerkReport/setDocketClerkReportMessagesTableSortAction';

export const setDocketClerkReportMessagesTableSortSequence = [
  setDocketClerkReportMessagesTableSortAction,
] as unknown as (props: { box: string }) => void;
