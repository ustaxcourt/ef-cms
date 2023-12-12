import { get } from '../requests';
import qs from 'qs';

export const exportPendingReportInteractor = (
  applicationContext,
  { judge },
) => {
  const queryString = qs.stringify({ judge });

  return get({
    applicationContext,
    endpoint: `/reports/pending-report/export?${queryString}`,
  });
};
