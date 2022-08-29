import {
  createEndOfDayISO,
  createISODateString,
  createStartOfDayISO,
  deconstructDate,
} from '../../utilities/DateHandler';
import {
  ORDER_EVENT_CODES,
  TODAYS_ORDERS_PAGE_SIZE,
} from '../../entities/EntityConstants';

/**
 * getTodaysOrdersInteractor
 *
 * @param {object} applicationContext application context object
 * @param {object} providers the providers object containing page
 * @param {string} providers.page the page of the order to get
 * @returns {array} an array of orders (if any)
 */
export const getTodaysOrdersInteractor = async (
  applicationContext: IApplicationContext,
  { page, todaysOrdersSort }: { page: number; todaysOrdersSort: string },
) => {
  const { day, month, year } = deconstructDate(createISODateString());
  const currentDateStart = createStartOfDayISO({ day, month, year });
  const currentDateEnd = createEndOfDayISO({ day, month, year });

  const from = (page - 1) * TODAYS_ORDERS_PAGE_SIZE;

  const { results, totalCount } = await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      documentEventCodes: ORDER_EVENT_CODES,
      endDate: currentDateEnd,
      from,
      omitSealed: true,
      overrideResultSize: TODAYS_ORDERS_PAGE_SIZE,
      sortField: todaysOrdersSort,
      startDate: currentDateStart,
    });

  return { results, totalCount };
};
