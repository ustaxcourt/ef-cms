const {
  createEndOfDayISO,
  createISODateString,
  createStartOfDayISO,
  deconstructDate,
} = require('../../utilities/DateHandler');
const { ORDER_EVENT_CODES } = require('../../entities/EntityConstants');

/**
 * getTodaysOrdersInteractor
 *
 * @param {object} providers the providers object containing applicationContext
 * @param {object} providers.applicationContext application context object
 * @returns {array} an array of orders (if any)
 */
exports.getTodaysOrdersInteractor = async ({ applicationContext }) => {
  const { day, month, year } = deconstructDate(createISODateString());
  const currentDateStart = createStartOfDayISO({ day, month, year });
  const currentDateEnd = createEndOfDayISO({ day, month, year });

  return await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      documentEventCodes: ORDER_EVENT_CODES,
      endDate: currentDateEnd,
      judgeType: 'signedJudgeName', // Fixme - refactor to entityconstants
      omitSealed: true,
      startDate: currentDateStart,
    });
};
