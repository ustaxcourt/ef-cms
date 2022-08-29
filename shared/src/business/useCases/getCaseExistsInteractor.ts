const { Case } = require('../entities/cases/Case');
const { NotFoundError } = require('../../errors/errors');

/**
 * getCaseExistsInteractor
 * Written to behave similarly to getCaseInteractor, except instead of returning
 * a complete case, will only return boolean 'true' if the case exists.
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to get
 * @returns {boolean} whether case exists for requested docket number
 */
exports.getCaseExistsInteractor = async (
  applicationContext,
  { docketNumber },
) => {
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: Case.formatDocketNumber(docketNumber),
    });

  const exists = Boolean(caseRecord.docketNumber && caseRecord.entityName);

  if (!exists) {
    const error = new NotFoundError(`Case ${docketNumber} was not found.`);
    error.skipLogging = true;
    throw error;
  }

  return exists;
};
