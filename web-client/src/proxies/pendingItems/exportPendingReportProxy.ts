import { ClientApplicationContext } from '@web-client/applicationContext';
import { get } from '../requests';
import qs from 'qs';

export const exportPendingReportInteractor = (
  applicationContext: ClientApplicationContext,
  queryParams: {
    judge: string;
    sortField: string;
    sortOrder: 'asc' | 'desc';
  },
) => {
  const queryString = qs.stringify(queryParams);

  return get({
    applicationContext,
    endpoint: `/reports/pending-report/export?${queryString}`,
  });
};
