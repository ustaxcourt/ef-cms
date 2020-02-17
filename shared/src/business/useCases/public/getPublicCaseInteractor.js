const { Case } = require('../../entities/cases/Case');
const { caseSealedFormatter } = require('../../utilities/caseFilter');
const { NotFoundError } = require('../../../errors/errors');
const { PublicCase } = require('../../entities/cases/PublicCase');

/**
 * getPublicCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to get
 * @returns {object} the case data
 */
exports.getPublicCaseInteractor = async ({ applicationContext, caseId }) => {
  let caseRecord;

  if (Case.isValidCaseId(caseId)) {
    caseRecord = await applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId({
        applicationContext,
        caseId,
      });
  } else if (Case.isValidDocketNumber(caseId)) {
    caseRecord = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber: Case.stripLeadingZeros(caseId),
      });
  }

  if (!caseRecord) {
    const error = new NotFoundError(`Case ${caseId} was not found.`);
    error.skipLogging = true;
    throw error;
  }

  if (caseRecord.sealedDate) {
    caseRecord = caseSealedFormatter(caseRecord);
  }

  const publicCaseDetail = new PublicCase(caseRecord, {
    applicationContext,
  })
    .validate()
    .toRawObject();

  return publicCaseDetail;
};
