import { formatStatusReportFilingDateAction } from '@web-client/presenter/actions/StatusReportOrderResponse/formatStatusReportFilingDateAction';
import { navigateToPathAction } from '@web-client/presenter/actions/navigateToPathAction';
import { setStatusReportOrderResponsePath } from '@web-client/presenter/actions/StatusReportOrderResponse/setStatusReportOrderResponsePath';

export const navigateToStatusReportOrderResponseSequence = [
  formatStatusReportFilingDateAction,
  setStatusReportOrderResponsePath,
  navigateToPathAction,
] as unknown as (props: {
  statusReportFilingDate: string;
  statusReportIndex: number;
  path: string;
}) => void;
