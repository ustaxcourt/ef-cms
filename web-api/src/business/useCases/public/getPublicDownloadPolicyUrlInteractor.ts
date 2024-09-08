import {
  ALLOWLIST_FEATURE_FLAGS,
  ROLES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import {
  Case,
  isSealedCase,
} from '../../../../../shared/src/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export const getPublicDownloadPolicyUrlInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    docketNumber,
    isTerminalUser,
    key,
  }: { docketNumber: string; isTerminalUser: boolean; key: string },
  authorizdeUser: UnknownAuthUser,
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

  const caseEntity = new Case(caseToCheck, { authorizedUser: authorizdeUser });

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

  if (docketEntryEntity.isSealed) {
    throw new UnauthorizedError('Docket entry has been sealed.');
  }

  if (
    isSealedCase(caseEntity) &&
    !DocketEntry.isOpinion(docketEntryEntity.eventCode)
  ) {
    throw new UnauthorizedError(
      'Unauthorized to access documents in a sealed case',
    );
  }

  const featureFlags = await applicationContext
    .getUseCases()
    .getAllFeatureFlagsInteractor(applicationContext);

  const documentVisibilityChangeDate =
    featureFlags[
      ALLOWLIST_FEATURE_FLAGS.DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE.key
    ];

  if (
    !DocketEntry.isDownloadable(docketEntryEntity, {
      isTerminalUser,
      rawCase: caseToCheck,
      user: {
        role: ROLES.petitioner,
        userId: '',
      },
      visibilityChangeDate: documentVisibilityChangeDate,
    })
  ) {
    throw new UnauthorizedError('Unauthorized to access private document');
  }

  return await applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
    applicationContext,
    key,
  });
};
