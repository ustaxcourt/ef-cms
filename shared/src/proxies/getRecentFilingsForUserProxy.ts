import { get } from './requests';
import { RecentFiling } from '@shared/business/entities/RecentFiling';

export const getRecentFilingsForUserInteractor = (
  applicationContext,
): Promise<RecentFiling[]> => {
  return get({
    applicationContext,
    endpoint: '/cases/recent-filings',
  });
};
