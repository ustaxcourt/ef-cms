const {
  createEndOfDayISO,
  createISODateString,
  createStartOfDayISO,
  deconstructDate,
} = require('../../utilities/DateHandler');
const {
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
} = require('../../entities/EntityConstants');

/**
 * getTodaysOpinionsInteractor
 *
 * @param {object} applicationContext application context object
 * @returns {array} an array of opinions (if any)
 */
exports.getTodaysOpinionsInteractor = async applicationContext => {
  const { day, month, year } = deconstructDate(createISODateString());
  const currentDateStart = createStartOfDayISO({ day, month, year });
  const currentDateEnd = createEndOfDayISO({ day, month, year });

  const { results } = await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      documentEventCodes: OPINION_EVENT_CODES_WITH_BENCH_OPINION,
      endDate: currentDateEnd,
      judgeType: 'judge',
      startDate: currentDateStart,
    });
  return results;
};
