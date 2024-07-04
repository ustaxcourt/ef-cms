import { FORMATS } from '@shared/business/utilities/DateHandler';

// TODO 10102: Do we need this anymore?
export const formatStatusReportFilingDateAction = ({
  applicationContext,
  props,
}: ActionProps) => {
  const formattedStatusReportFilingDate = applicationContext
    .getUtilities()
    .formatDateString(props.statusReportFilingDate, FORMATS.YYYYMMDD);

  return { statusReportFilingDate: formattedStatusReportFilingDate };
};
