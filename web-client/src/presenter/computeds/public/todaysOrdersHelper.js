import { state } from 'cerebral';

export const todaysOrdersHelper = (get, applicationContext) => {
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

  return {
    formattedCurrentDate,
    formattedOrders,
    hasResults,
    showLoadMoreButton,
  };
};
