import { formatStatusReportFilingDateAction } from '@web-client/presenter/actions/formatStatusReportFilingDateAction';
import { navigateToStatusReportOrderResponseAction } from '../../actions/StatusReportOrderResponse/navigateToStatusReportOrderResponseAction';
import { setStatusReportOrderResponseFormAction } from '@web-client/presenter/actions/StatusReportOrderResponse/setStatusReportOrderResponseFormAction';

export const navigateToStatusReportOrderResponseSequence = [
  formatStatusReportFilingDateAction,
  setStatusReportOrderResponseFormAction,
  navigateToStatusReportOrderResponseAction,
] as unknown as (props: {
  statusReportFilingDate: string;
  statusReportIndex: number;
  url: string;
}) => void;
