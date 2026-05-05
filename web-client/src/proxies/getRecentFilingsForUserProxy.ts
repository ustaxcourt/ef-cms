import { get } from './requests';
import { RecentFiling } from '@shared/business/useCases/getRecentFilingsForUserInteractor';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getRecentFilingsForUserInteractor = (
  applicationContext: ClientApplicationContext,
): Promise<RecentFiling[]> => {
  return get({
    applicationContext,
    endpoint: '/cases/recent-filings',
  });
};
