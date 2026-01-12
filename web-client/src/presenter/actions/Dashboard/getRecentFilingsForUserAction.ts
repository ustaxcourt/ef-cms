import { getRecentFilingsForUserInteractor } from '@shared/proxies/getRecentFilingsForUserProxy';
import { RecentFiling } from '@shared/business/useCases/getRecentFilingsForUserInteractor';

export const getRecentFilingsForUserAction = async ({
  applicationContext,
}: ActionProps): Promise<{ recentFilings: RecentFiling[] }> => {
  try {
    const recentFilings =
      await getRecentFilingsForUserInteractor(applicationContext);
    return { recentFilings };
  } catch (error) {
    throw new Error(`Failed to fetch recent filings: ${error}`);
  }
};
