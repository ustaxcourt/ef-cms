import { ALLOWLIST_FEATURE_FLAGS } from '../../../../../shared/src/business/entities/EntityConstants';
import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { DocketEntry } from '../../../../../shared/src/business/entities/DocketEntry';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { User } from '@shared/business/entities/User';

export const getDownloadPolicyUrlInteractor = async (
  applicationContext: ServerApplicationContext,
  { docketNumber, key }: { docketNumber: string; key: string },
  authorizedUser: UnknownAuthUser,
): Promise<{ url: string }> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.VIEW_DOCUMENTS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseData = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  if (!caseData.docketNumber && !caseData.entityName) {
    throw new NotFoundError(`Case ${docketNumber} was not found.`);
  }

  const caseEntity = new Case(caseData, { authorizedUser });
  const docketEntryEntity = caseEntity.getDocketEntryById({
    docketEntryId: key,
  });

  if (key.includes('.pdf')) {
    if (
      caseEntity.getCaseConfirmationGeneratedPdfFileName() !== key ||
      !caseEntity.userHasAccessToCase(authorizedUser)
    ) {
      throw new UnauthorizedError('Unauthorized');
    }
  } else if (caseEntity.getCorrespondenceById({ correspondenceId: key })) {
    if (!User.isInternalUser(authorizedUser.role)) {
      throw new UnauthorizedError(UNAUTHORIZED_DOCUMENT_MESSAGE);
    }
  } else {
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

    if (
      !DocketEntry.isDownloadable(docketEntryEntity, {
        isTerminalUser: false,
        rawCase: caseData,
        user: authorizedUser,
        visibilityChangeDate: documentVisibilityChangeDate,
      })
    ) {
      throw new UnauthorizedError(UNAUTHORIZED_DOCUMENT_MESSAGE);
    }
  }

  return applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
    applicationContext,
    key,
  });
};

export const UNAUTHORIZED_DOCUMENT_MESSAGE =
  'Unauthorized to view document at this time.';
