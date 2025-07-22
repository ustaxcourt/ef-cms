import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import {
  DESCENDING,
  STANDING_PRETRIAL_EVENT_CODES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app-public.cerebral';
import { Case } from '@shared/business/entities/cases/Case';
import {
  SUPPORTED_SORT_FIELDS_FOR_TODAYS_ORDERS,
  sortOptions,
} from '@web-client/views/Public/TodaysOrdersConstants';

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

  const tableSort = get(state.tableSort);

  const sortedFormattedOrders = formattedOrders.sort((orderA, orderB) => {
    let sortNumber = 0;
    const compare1 = tableSort?.sortOrder === DESCENDING ? orderB : orderA;
    const compare2 = tableSort?.sortOrder === DESCENDING ? orderA : orderB;

    if (!tableSort) {
      sortNumber = compare1.createdAt.localeCompare(compare2.createdAt);
    } else if (
      SUPPORTED_SORT_FIELDS_FOR_TODAYS_ORDERS.includes(tableSort.sortField)
    ) {
      const compare1SortField: string = compare1[tableSort.sortField] || '';
      const compare2SortField: string = compare2[tableSort.sortField] || '';

      sortNumber = compare1SortField
        .toString()
        .localeCompare(compare2SortField.toString());
    } else if (tableSort.sortField === 'docketNumber') {
      sortNumber = Case.docketNumberSort(
        compare1.docketNumber,
        compare2.docketNumber,
      );
    }
    return sortNumber;
  });

  const hasResults = sortedFormattedOrders.length > 0;

  const showLoadMoreButton = sortedFormattedOrders.length < totalCount;
  const todaysOrdersSort =
    get(state.sessionMetadata.todaysOrdersSort) || TODAYS_ORDERS_SORT_DEFAULT;

  return {
    columnData,
    formattedCurrentDate,
    formattedOrders: sortedFormattedOrders,
    hasResults,
    showLoadMoreButton,
    sortOptions,
    todaysOrdersSort,
    totalCount,
  };
};
