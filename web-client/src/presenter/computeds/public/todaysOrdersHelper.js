import { state } from 'cerebral';

export const todaysOrdersHelper = (get, applicationContext) => {
  const todaysOrders = get(state.todaysOrders);

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

  return { formattedCurrentDate, formattedOrders };
};
