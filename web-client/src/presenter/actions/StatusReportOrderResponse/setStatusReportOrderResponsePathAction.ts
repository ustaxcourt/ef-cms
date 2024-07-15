import qs from 'qs';

export const setStatusReportOrderResponsePathAction = ({
  props,
}: ActionProps) => {
  const { statusReportFilingDate, statusReportIndex } = props;

  const queryString = qs.stringify({
    statusReportFilingDate,
    statusReportIndex,
  });

  return { path: `${props.path}?${queryString}` };
};