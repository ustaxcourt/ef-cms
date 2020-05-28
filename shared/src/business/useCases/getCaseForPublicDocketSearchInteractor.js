const { Case } = require('../entities/cases/Case');
const { getDocumentContentsForDocuments } = require('./getCaseInteractor');
const { NotFoundError } = require('../../errors/errors');

/**
 * getCaseForPublicDocketSearchInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to get
 * @returns {object} the case data
 */
exports.getCaseForPublicDocketSearchInteractor = async ({
  applicationContext,
  caseId,
}) => {
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

  let caseDetailRaw;

  if (caseRecord.sealedDate) {
    return null;
  } else {
    caseDetailRaw = new Case(caseRecord, {
      applicationContext,
    })
      .validate()
      .toRawObject();

    caseDetailRaw.documents = await getDocumentContentsForDocuments({
      applicationContext,
      documents: caseDetailRaw.documents,
    });
  }
  return caseDetailRaw;
};
