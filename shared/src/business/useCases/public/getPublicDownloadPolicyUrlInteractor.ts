import {
  ALLOWLIST_FEATURE_FLAGS,
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
} from '../../entities/EntityConstants';
import { Case, isSealedCase } from '../../entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { PublicCase } from '../../entities/cases/PublicCase';

export const getPublicDownloadPolicyUrlInteractor = async (
  applicationContext: IApplicationContext,
  {
    docketNumber,
    isTerminalUser,
    key,
  }: { docketNumber: string; isTerminalUser: boolean; key: string },
): Promise<{ url: string }> => {
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

  const featureFlags = await applicationContext
    .getUseCases()
    .getAllFeatureFlagsInteractor(applicationContext);

  const documentVisibilityChangeDate =
    featureFlags[
      ALLOWLIST_FEATURE_FLAGS.DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE.key
    ];

  const isPrivate = PublicCase.isPrivateDocument(
    docketEntryEntity,
    applicationContext
      .getUtilities()
      .createISODateString(documentVisibilityChangeDate, 'yyyy-MM-dd'),
  );

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
