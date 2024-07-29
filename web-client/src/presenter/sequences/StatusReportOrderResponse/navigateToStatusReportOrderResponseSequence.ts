import { formatStatusReportFilingDateAction } from '@web-client/presenter/actions/StatusReportOrderResponse/formatStatusReportFilingDateAction';
import { navigateToPathAction } from '@web-client/presenter/actions/navigateToPathAction';
import { setStatusReportOrderResponsePathAction } from '@web-client/presenter/actions/StatusReportOrderResponse/setStatusReportOrderResponsePathAction';

export const navigateToStatusReportOrderResponseSequence = [
  formatStatusReportFilingDateAction,
  setStatusReportOrderResponsePathAction,
  navigateToPathAction,
] as unknown as (props: {
  statusReportFilingDate: string;
  statusReportIndex: number;
  path: string;
}) => void;
