import { ClientApplicationContext } from '@web-client/applicationContext';
import { get } from '../requests';
import qs from 'qs';

export const generatePrintablePendingReportInteractor = (
  applicationContext: ClientApplicationContext,
  params: {
    docketNumber?: string;
    judge?: string;
    sortField?: string;
    sortOrder?: string;
  },
) => {
  const queryString = qs.stringify(params);

  return get({
    applicationContext,
    endpoint: `/reports/pending-report?${queryString}`,
  });
};
