import { batchCompleteDocketClerkReportMessagesAction } from '../actions/DocketClerkReport/batchCompleteDocketClerkReportMessagesAction';
import { setWaitingForResponseAction } from '@web-client/presenter/actions/setWaitingForResponseAction';

export const batchCompleteDocketClerkReportMessagesSequence = [
  setWaitingForResponseAction,
  batchCompleteDocketClerkReportMessagesAction,
];
