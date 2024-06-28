import {
  ORDER_EVENT_CODES,
  TODAYS_ORDERS_PAGE_SIZE,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  createEndOfDayISO,
  createISODateString,
  createStartOfDayISO,
  deconstructDate,
} from '../../../../../shared/src/business/utilities/DateHandler';

export const getTodaysOrdersInteractor = async (
  applicationContext: ServerApplicationContext,
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
