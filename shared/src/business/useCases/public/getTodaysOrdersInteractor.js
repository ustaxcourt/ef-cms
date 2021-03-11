const {
  createEndOfDayISO,
  createISODateString,
  createStartOfDayISO,
  deconstructDate,
} = require('../../utilities/DateHandler');
const {
  ORDER_EVENT_CODES,
  ORDER_JUDGE_FIELD,
  TODAYS_ORDERS_PAGE_SIZE,
} = require('../../entities/EntityConstants');

/**
 * getTodaysOrdersInteractor
 *
 * @param {object} applicationContext application context object
 * @param {object} providers the providers object containing page
 * @returns {array} an array of orders (if any)
 */
exports.getTodaysOrdersInteractor = async (applicationContext, { page }) => {
  const { day, month, year } = deconstructDate(createISODateString());
  const currentDateStart = createStartOfDayISO({ day, month, year });
  const currentDateEnd = createEndOfDayISO({ day, month, year });

  const from = (page - 1) * TODAYS_ORDERS_PAGE_SIZE;

  const {
    results,
    totalCount,
  } = await applicationContext.getPersistenceGateway().advancedDocumentSearch({
    applicationContext,
    documentEventCodes: ORDER_EVENT_CODES,
    endDate: currentDateEnd,
    from,
    judgeType: ORDER_JUDGE_FIELD,
    omitSealed: true,
    overrideResultSize: TODAYS_ORDERS_PAGE_SIZE,
    overrideSort: true,
    startDate: currentDateStart,
  });

  return { results, totalCount };
};
