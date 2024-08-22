import { formatStatusReportFilingDateAction } from '@web-client/presenter/actions/StatusReportOrder/formatStatusReportFilingDateAction';
import { navigateToPathAction } from '@web-client/presenter/actions/navigateToPathAction';
import { setStatusReportOrderPathAction } from '@web-client/presenter/actions/StatusReportOrder/setStatusReportOrderPathAction';

export const navigateToStatusReportOrderSequence = [
  formatStatusReportFilingDateAction,
  setStatusReportOrderPathAction,
  navigateToPathAction,
] as unknown as (props: {
  statusReportFilingDate: string;
  statusReportIndex: number;
  path: string;
}) => void;
