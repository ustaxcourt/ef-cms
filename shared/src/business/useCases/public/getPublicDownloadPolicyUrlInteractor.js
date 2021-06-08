const {
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
} = require('../../entities/EntityConstants');
const { Case, isSealedCase } = require('../../entities/cases/Case');
const { isPrivateDocument } = require('../../entities/cases/PublicCase');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');

/**
 * getPublicDownloadPolicyUrlInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case containing the document
 * @param {string} providers.key the key of the document to get
 * @returns {string} the document download url
 */
exports.getPublicDownloadPolicyUrlInteractor = async (
  applicationContext,
  { docketNumber, key },
) => {
  const caseToCheck = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  if (!caseToCheck.docketNumber && !caseToCheck.entityName) {
    throw new NotFoundError(`Case ${docketNumber} was not found.`);
  }

  const caseEntity = new Case(caseToCheck, { applicationContext });

  const docketEntryEntity = caseEntity.getDocketEntryById({
    docketEntryId: key,
  });

  if (!docketEntryEntity) {
    throw new NotFoundError(`Docket entry ${key} was not found.`);
  }
  if (!docketEntryEntity.isFileAttached) {
    throw new NotFoundError(
      `Docket entry ${key} does not have an attached file.`,
    );
  }

  const isPrivate = isPrivateDocument(docketEntryEntity);

  if (isPrivate) {
    throw new UnauthorizedError('Unauthorized to access private document');
  }

  const isOpinionDocument = OPINION_EVENT_CODES_WITH_BENCH_OPINION.includes(
    docketEntryEntity.eventCode,
  );

  // opinion documents are public even in sealed cases
  if (isSealedCase(caseEntity) && !isOpinionDocument) {
    throw new UnauthorizedError(
      'Unauthorized to access documents in a sealed case',
    );
  }

  return await applicationContext
    .getPersistenceGateway()
    .getPublicDownloadPolicyUrl({
      applicationContext,
      key,
    });
};
