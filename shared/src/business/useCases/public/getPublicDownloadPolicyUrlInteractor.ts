import { Case, isSealedCase } from '../../entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '../../../errors/errors';
import { OPINION_EVENT_CODES_WITH_BENCH_OPINION } from '../../entities/EntityConstants';
import { PublicCase } from '../../entities/cases/PublicCase';

/**
 * getPublicDownloadPolicyUrlInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case containing the document
 * @param {string} providers.key the key of the document to get
 * @returns {Promise<string>} the document download url
 */
export const getPublicDownloadPolicyUrlInteractor = async (
  applicationContext: IApplicationContext,
  {
    docketNumber,
    isTerminalUser,
    key,
  }: { docketNumber: string; isTerminalUser: boolean; key: string },
) => {
  const caseToCheck: any = await applicationContext
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

  const isPrivate = PublicCase.isPrivateDocument(docketEntryEntity);

  if (!isTerminalUser && isPrivate) {
    throw new UnauthorizedError('Unauthorized to access private document');
  }

  const isOpinionDocument = OPINION_EVENT_CODES_WITH_BENCH_OPINION.includes(
    docketEntryEntity.eventCode,
  );

  if (docketEntryEntity.isSealed) {
    throw new UnauthorizedError('Docket entry has been sealed.');
  }

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
