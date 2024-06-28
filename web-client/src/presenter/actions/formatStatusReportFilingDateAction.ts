export const formatStatusReportFilingDateAction = ({
  applicationContext,
  props,
}: ActionProps) => {
  const formattedStatusReportFilingDate = applicationContext
    .getUtilities()
    .formatDateString(props.statusReportFilingDate, 'MM/dd/yyyy');

  return { statusReportFilingDate: formattedStatusReportFilingDate };
};
