const { getCase } = require('./getCaseInteractor');

/**
 * getCaseByDocketNumberInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to get
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

  return await getCase({ applicationContext, caseId: caseRecord.caseId });
};
