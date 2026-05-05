import { ClientApplicationContext } from '@web-client/applicationContext';
import { get } from './requests';

export const getCaseDocketEntriesInteractor = (
  applicationContext: ClientApplicationContext,
  {
    docketNumber,
    page,
  }: {
    docketNumber: string;
    page?: number;
  },
) => {
  return get({
    applicationContext,
    endpoint: `/cases/${docketNumber}/docket-entries`,
    params: {
      page: page ?? 0,
    },
  });
};
