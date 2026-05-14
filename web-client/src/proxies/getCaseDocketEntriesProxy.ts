import { get } from './requests';

export const getCaseDocketEntriesInteractor = (
  applicationContext,
  { docketNumber, page = 0 }: { docketNumber: string; page?: number },
) => {
  return get({
    applicationContext,
    endpoint: `/cases/${docketNumber}/docket-entries?page=${page}`,
  });
};
