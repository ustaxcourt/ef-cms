import { get } from '../requests';
import qs from 'qs';

export const exportPendingReportInteractor = (
  applicationContext,
  { judge, method },
) => {
  const queryString = qs.stringify({ judge, method });

  return get({
    applicationContext,
    endpoint: `/reports/pending-report/export?${queryString}`,
  });
};
