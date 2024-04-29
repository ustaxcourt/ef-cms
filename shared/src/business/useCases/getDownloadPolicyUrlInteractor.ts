import { ALLOWLIST_FEATURE_FLAGS } from '../entities/EntityConstants';
import { Case } from '../entities/cases/Case';
import { DocketEntry } from '../entities/DocketEntry';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { User } from '@shared/business/entities/User';

export const getDownloadPolicyUrlInteractor = async (
  applicationContext: IApplicationContext,
  { docketNumber, key }: { docketNumber: string; key: string },
): Promise<{ url: string }> => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.VIEW_DOCUMENTS)) {
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

  const caseEntity = new Case(caseData, { applicationContext });
  const docketEntryEntity = caseEntity.getDocketEntryById({
    docketEntryId: key,
  });

  if (key.includes('.pdf')) {
    if (
      caseEntity.getCaseConfirmationGeneratedPdfFileName() !== key ||
      !caseEntity.userHasAccessToCase(user)
    ) {
      throw new UnauthorizedError('Unauthorized');
    }
  } else if (caseEntity.getCorrespondenceById({ correspondenceId: key })) {
    if (!User.isInternalUser(user.role)) {
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
        user,
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
