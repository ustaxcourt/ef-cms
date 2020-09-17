const {
  caseContactAddressSealedFormatter,
  caseSealedFormatter,
} = require('../../utilities/caseFilter');
const { Case } = require('../../entities/cases/Case');
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
  const rawCaseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: Case.stripLeadingZeros(docketNumber),
    });

  if (!rawCaseRecord.docketNumber && !rawCaseRecord.entityName) {
    const error = new NotFoundError(`Case ${docketNumber} was not found.`);
    error.skipLogging = true;
    throw error;
  }

  let caseRecord = rawCaseRecord;
  if (rawCaseRecord.sealedDate) {
    caseRecord = caseSealedFormatter(caseRecord);
  }
  caseRecord = caseContactAddressSealedFormatter(caseRecord, {});

  const publicCaseDetail = new PublicCase(caseRecord, {
    applicationContext,
  })
    .validate()
    .toRawObject();

  return publicCaseDetail;
};
