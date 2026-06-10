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
import { PublicDocketEntry } from '@shared/business/entities/cases/PublicDocketEntry';

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

  const formattedResults = results.map(order => {
    const publicOrder = new PublicDocketEntry(order).toRawObject();
    return { ...publicOrder, caseCaption: order.caseCaption };
  });

  return { results: formattedResults, totalCount };
};
