import { ClientPublicApplicationContext } from '@web-client/applicationContextPublic';
import { state } from '@web-client/presenter/app-public.cerebral';

/**
 * gets today's orders
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @returns {Promise} a list of today's order documents
 */
export const getTodaysOrdersAction = async ({
  applicationContext,
  get,
}: ActionProps<{}, ClientPublicApplicationContext>) => {
  const { TODAYS_ORDERS_SORT_DEFAULT } = applicationContext.getConstants();
  const todaysOrdersSort =
    get(state.sessionMetadata.todaysOrdersSort) || TODAYS_ORDERS_SORT_DEFAULT;

  const allResults: any[] = [];
  let page = 1;
  let totalCount = 0;

  // Fetch all pages so the full result set is available for client-side sort & pagination
  do {
    const { results, totalCount: fetchedTotalCount } = await applicationContext
      .getUseCases()
      .getTodaysOrdersInteractor(applicationContext, {
        page,
        todaysOrdersSort,
      });

    totalCount = fetchedTotalCount;
    allResults.push(...results);
    page++;
  } while (allResults.length < totalCount);

  return { todaysOrders: allResults, totalCount };
};
