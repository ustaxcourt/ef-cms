import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { STANDING_PRETRIAL_EVENT_CODES } from '../../../../../shared/src/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app-public.cerebral';
import { sortOptions } from '@web-client/views/Public/TodaysOrdersConstants';

export const todaysOrdersHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
) => {
  const { TODAYS_ORDERS_SORT_DEFAULT } = applicationContext.getConstants();

  // Use sortField from sortOptions for columnData
  const columnData = sortOptions.map(option => ({
    columnName: option.label,
    sortFieldInfo: { sortField: option.sortField, sortType: 'string' }, // adjust sortType as needed
  }));

  const todaysOrders = get(state.todaysOrders.results);
  const totalCount = get(state.todaysOrders.totalCount);

  const currentDate = applicationContext.getUtilities().createISODateString();
  const formattedCurrentDate = applicationContext
    .getUtilities()
    .formatDateString(currentDate, 'MONTH_DAY_YEAR');

  const formattedOrders = todaysOrders.map(order => {
    const judgeName = STANDING_PRETRIAL_EVENT_CODES.includes(order.eventCode)
      ? order.judge
      : order.signedJudgeName;

    return {
      ...order,
      formattedFilingDate: applicationContext
        .getUtilities()
        .formatDateString(order.filingDate, 'MMDDYY'),
      formattedJudgeName: applicationContext
        .getUtilities()
        .getJudgeLastName(judgeName),
      numberOfPagesFormatted: order.numberOfPages ?? 'n/a',
    };
  });

  const hasResults = formattedOrders.length > 0;

  const todaysOrdersSort =
    get(state.sessionMetadata.todaysOrdersSort) || TODAYS_ORDERS_SORT_DEFAULT;

  return {
    columnData,
    formattedCurrentDate,
    formattedOrders: formattedOrders,
    hasResults,
    sortOptions,
    todaysOrdersSort,
    totalCount,
  };
};
