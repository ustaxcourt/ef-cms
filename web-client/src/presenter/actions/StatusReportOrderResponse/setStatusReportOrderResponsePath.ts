import qs from 'qs';

export const setStatusReportOrderResponsePath = ({ props }: ActionProps) => {
  const { statusReportFilingDate, statusReportIndex } = props;

  const queryString = qs.stringify({
    statusReportFilingDate,
    statusReportIndex,
  });

  return { path: `${props.path}?${queryString}` };
};
