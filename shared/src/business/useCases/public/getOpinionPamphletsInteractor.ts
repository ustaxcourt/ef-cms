import { OPINION_EVENT_CODES_WITH_BENCH_OPINION } from '../../entities/EntityConstants';
import {
  createEndOfDayISO,
  createISODateString,
  createStartOfDayISO,
  deconstructDate,
} from '../../utilities/DateHandler';

/**
 * getOpinionPamphletsInteractor
 *
 * @param {object} applicationContext application context object
 * @returns {array} an array of opinion pamphlets (if any)
 */
export const getOpinionPamphletsInteractor = async (
  applicationContext: IApplicationContext,
) => {
  //todo - actual implementation
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
