import { ClientPublicApplicationContext } from '@web-client/applicationContextPublic';
import { get } from './requests';

export const getPublicCaseDocketEntriesInteractor = (
  applicationContext: ClientPublicApplicationContext,
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
    endpoint: `/public-api/cases/${docketNumber}/docket-entries`,
    params: {
      page: page ?? 0,
    },
  });
};
