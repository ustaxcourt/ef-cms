const { getCase } = require('./getCaseInteractor');
const { NotFoundError } = require('../../errors/errors');

/**
 * getCaseByDocketNumberInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to retrieve
 * @returns {object} the case data
 */
exports.getCaseByDocketNumberInteractor = async ({
  applicationContext,
  docketNumber,
}) => {
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  if (!caseRecord) {
    const error = new NotFoundError(`Case ${docketNumber} was not found.`);
    error.skipLogging = true;
    throw error;
  }

  return await getCase({ applicationContext, caseId: caseRecord.caseId });
};
