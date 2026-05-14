import { get } from './requests';

export const getPublicCaseDocketEntriesInteractor = (
  applicationContext,
  { docketNumber, page = 0 }: { docketNumber: string; page?: number },
) => {
  return get({
    applicationContext,
    endpoint: `/public-api/cases/${docketNumber}/docket-entries?page=${page}`,
  });
};
