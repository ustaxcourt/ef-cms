import { OPINION_EVENT_CODES_WITH_BENCH_OPINION } from '../../../../../shared/src/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  createEndOfDayISO,
  createISODateString,
  createStartOfDayISO,
  deconstructDate,
} from '../../../../../shared/src/business/utilities/DateHandler';

export const getTodaysOpinionsInteractor = async (
  applicationContext: ServerApplicationContext,
) => {
  const { day, month, year } = deconstructDate(createISODateString());
  const currentDateStart = createStartOfDayISO({ day, month, year });
  const currentDateEnd = createEndOfDayISO({ day, month, year });

  const { results } = await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      documentEventCodes: OPINION_EVENT_CODES_WITH_BENCH_OPINION,
      endDate: currentDateEnd,
      isOpinionSearch: true,
      startDate: currentDateStart,
    });
  return results;
};
