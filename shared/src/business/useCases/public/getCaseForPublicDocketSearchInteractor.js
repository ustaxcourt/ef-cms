const { Case } = require('../../entities/cases/Case');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');
const { PublicCase } = require('../../entities/cases/PublicCase');

/**
 * getCaseForPublicDocketSearchInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to get
 * @returns {object} the case data
 */
exports.getCaseForPublicDocketSearchInteractor = async ({
  applicationContext,
  docketNumber,
}) => {
  const caseRecord = await applicationContext
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

  let caseDetailRaw;

  if (caseRecord.sealedDate || caseRecord.isSealed) {
    const error = new UnauthorizedError(`Case ${docketNumber} is sealed.`);
    error.skipLogging = true;
    throw error;
  } else {
    caseDetailRaw = new PublicCase(caseRecord, {
      applicationContext,
    })
      .validate()
      .toRawObject();
  }
  return caseDetailRaw;
};
