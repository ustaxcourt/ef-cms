const { Case } = require('../../entities/cases/Case');
const { caseSealedFormatter } = require('../../utilities/caseFilter');
const { NotFoundError } = require('../../../errors/errors');
const { PublicCase } = require('../../entities/cases/PublicCase');

/**
 * getPublicCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to get
 * @returns {object} the case data
 */
exports.getPublicCaseInteractor = async ({
  applicationContext,
  docketNumber,
}) => {
  let caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: Case.stripLeadingZeros(docketNumber),
    });

  if (!caseRecord) {
    const error = new NotFoundError(`Case ${docketNumber} was not found.`);
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
