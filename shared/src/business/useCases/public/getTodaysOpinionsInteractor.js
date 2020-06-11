const { formatNow, FORMATS } = require('../../utilities/DateHandler');
const { OPINION_DOCUMENT_TYPES } = require('../../entities/EntityConstants');

// eslint-disable-next-line spellcheck/spell-checker
/**
 * getTodaysOpinionsInteractor
 *
 * @param {object} providers the providers object containing applicationContext, keyword
 * @param {object} providers.applicationContext application context object
 * @returns {array} an array of opinions (if any)
 */
exports.getTodaysOpinionsInteractor = async ({ applicationContext }) => {
  const currentDate = formatNow(FORMATS.MMDDYYYY);

  const currentDateSplit = currentDate.split('/');
  const currentDateMonth = currentDateSplit[0];
  const currentDateDay = currentDateSplit[1];
  const currentDateYear = currentDateSplit[2];

  return await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      documentEventCodes: OPINION_DOCUMENT_TYPES,
      endDateDay: currentDateDay,
      endDateMonth: currentDateMonth,
      endDateYear: currentDateYear,
      startDateDay: currentDateDay,
      startDateMonth: currentDateMonth,
      startDateYear: currentDateYear,
    });
};
