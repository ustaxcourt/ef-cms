const {
  BENCH_OPINION_EVENT_CODE,
  OPINION_EVENT_CODES,
} = require('../../entities/EntityConstants');
const {
  createEndOfDayISO,
  createISODateString,
  createStartOfDayISO,
  deconstructDate,
} = require('../../utilities/DateHandler');

/**
 * getTodaysOpinionsInteractor
 *
 * @param {object} providers the providers object containing applicationContext
 * @param {object} providers.applicationContext application context object
 * @returns {array} an array of opinions (if any)
 */
exports.getTodaysOpinionsInteractor = async ({ applicationContext }) => {
  const { day, month, year } = deconstructDate(createISODateString());
  const currentDateStart = createStartOfDayISO({ day, month, year });
  const currentDateEnd = createEndOfDayISO({ day, month, year });

  const {
    results,
  } = await applicationContext.getPersistenceGateway().advancedDocumentSearch({
    applicationContext,
    documentEventCodes: [...OPINION_EVENT_CODES, BENCH_OPINION_EVENT_CODE],
    endDate: currentDateEnd,
    judgeType: 'judge',
    startDate: currentDateStart,
  });
  return results;
};
