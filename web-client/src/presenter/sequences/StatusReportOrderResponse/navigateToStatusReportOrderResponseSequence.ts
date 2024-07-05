import { formatStatusReportFilingDateAction } from '@web-client/presenter/actions/StatusReportOrderResponse/formatStatusReportFilingDateAction';
import { navigateToPathAction } from '@web-client/presenter/actions/navigateToPathAction';
import { setStatusReportOrderResponseFormAction } from '@web-client/presenter/actions/StatusReportOrderResponse/setStatusReportOrderResponseFormAction';

export const navigateToStatusReportOrderResponseSequence = [
  formatStatusReportFilingDateAction,
  setStatusReportOrderResponseFormAction,
  navigateToPathAction,
] as unknown as (props: {
  statusReportFilingDate: string;
  statusReportIndex: number;
  path: string;
}) => void;
