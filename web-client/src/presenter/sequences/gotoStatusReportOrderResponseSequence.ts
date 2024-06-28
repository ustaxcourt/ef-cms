import { formatStatusReportFilingDateAction } from '@web-client/presenter/actions/formatStatusReportFilingDateAction';
import { navigateToStatusReportOrderResponseAction } from '../actions/navigateToStatusReportOrderResponseAction';
import { setStatusReportOrderResponseFormAction } from '@web-client/presenter/actions/setStatusReportOrderResponseFormAction';

export const gotoStatusReportOrderResponseSequence = [
  formatStatusReportFilingDateAction,
  setStatusReportOrderResponseFormAction,
  navigateToStatusReportOrderResponseAction,
];
