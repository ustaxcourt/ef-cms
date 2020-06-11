const {
  createEndOfDayISO,
  createISODateString,
  createStartOfDayISO,
  deconstructDate,
} = require('../../utilities/DateHandler');
const { OPINION_DOCUMENT_TYPES } = require('../../entities/EntityConstants');

// eslint-disable-next-line spellcheck/spell-checker
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

  return await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      documentEventCodes: OPINION_DOCUMENT_TYPES,
      endDate: currentDateEnd,
      judgeType: 'judge',
      startDate: currentDateStart,
    });
};
