import { FORMATS } from '@shared/business/utilities/DateHandler';

export const formatStatusReportFilingDateAction = ({
  applicationContext,
  props,
}: ActionProps) => {
  const formattedStatusReportFilingDate = applicationContext
    .getUtilities()
    .formatDateString(props.statusReportFilingDate, FORMATS.YYYYMMDD);

  return { statusReportFilingDate: formattedStatusReportFilingDate };
};
