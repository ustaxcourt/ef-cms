import { state } from 'cerebral';

export const todaysOrdersHelper = (get, applicationContext) => {
  const { TODAYS_ORDERS_SORT_DEFAULT, TODAYS_ORDERS_SORTS } =
    applicationContext.getConstants();

  const sortOptions = [
    { label: 'newest', value: TODAYS_ORDERS_SORTS.FILING_DATE_DESC }, // equal to TODAYS_ORDERS_SORT_DEFAULT
    {
      label: 'oldest',
      value: TODAYS_ORDERS_SORTS.FILING_DATE_ASC,
    },
    {
      label: 'pages (ascending)',
      value: TODAYS_ORDERS_SORTS.NUMBER_OF_PAGES_ASC,
    },
    {
      label: 'pages (descending)',
      value: TODAYS_ORDERS_SORTS.NUMBER_OF_PAGES_DESC,
    },
  ];

  const todaysOrders = get(state.todaysOrders.results);
  const totalCount = get(state.todaysOrders.totalCount);

  const currentDate = applicationContext.getUtilities().createISODateString();
  const formattedCurrentDate = applicationContext
    .getUtilities()
    .formatDateString(currentDate, 'MMMM D, YYYY');

  const formattedOrders = todaysOrders.map(order => ({
    ...order,
    formattedFilingDate: applicationContext
      .getUtilities()
      .formatDateString(order.filingDate, 'MMDDYY'),
    formattedJudgeName: applicationContext
      .getUtilities()
      .getJudgeLastName(order.signedJudgeName),
  }));

  const hasResults = formattedOrders.length > 0;

  const showLoadMoreButton = formattedOrders.length < totalCount;
  const todaysOrdersSort =
    get(state.sessionMetadata.todaysOrdersSort) || TODAYS_ORDERS_SORT_DEFAULT;

  return {
    formattedCurrentDate,
    formattedOrders,
    hasResults,
    showLoadMoreButton,
    sortOptions,
    todaysOrdersSort,
    totalCount,
  };
};
