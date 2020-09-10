const { Case } = require('../../entities/cases/Case');
const { isPrivateDocument } = require('../../entities/cases/PublicCase');
const { OPINION_EVENT_CODES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getPublicDownloadPolicyUrlInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case containing the document
 * @param {string} providers.key the key of the document to get
 * @returns {string} the document download url
 */
exports.getPublicDownloadPolicyUrlInteractor = async ({
  applicationContext,
  docketNumber,
  key,
}) => {
  const caseToCheck = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseToCheck, { applicationContext });

  const docketEntryEntity = caseEntity.getDocketEntryById({
    docketEntryId: key,
  });

  const isPrivate = isPrivateDocument(
    docketEntryEntity,
    caseEntity.docketEntries,
  );

  if (isPrivate) {
    throw new UnauthorizedError('Unauthorized to access private document');
  }

  const isOpinionDocument = OPINION_EVENT_CODES.includes(
    docketEntryEntity.eventCode,
  );

  // opinion documents are public even in sealed cases
  if (caseEntity.isSealed && !isOpinionDocument) {
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
