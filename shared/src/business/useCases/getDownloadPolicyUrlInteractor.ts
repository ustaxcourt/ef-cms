import {
  ALLOWLIST_FEATURE_FLAGS,
  INITIAL_DOCUMENT_TYPES,
  ROLES,
} from '../entities/EntityConstants';
import { Case, isSealedCase, isUserPartOfGroup } from '../entities/cases/Case';
import { DocketEntry } from '../entities/DocketEntry';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { User } from '../entities/User';

export const getDownloadPolicyUrlInteractor = async (
  applicationContext: IApplicationContext,
  { docketNumber, key }: { docketNumber: string; key: string },
): Promise<{ url: string }> => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.VIEW_DOCUMENTS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { isInternalUser, isIrsSuperuser, isPetitionsClerk } =
    getUserRoles(user);

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
  const petitionDocketEntry = caseEntity.getPetitionDocketEntry();
  const docketEntryEntity = caseEntity.getDocketEntryById({
    docketEntryId: key,
  });

  if (isInternalUser) {
    handleInternalUser({
      docketEntryEntity,
      isPetitionsClerk,
      petitionDocketEntry,
    });
  } else if (isIrsSuperuser) {
    handleIrsSuperUser({ docketEntryEntity, key, petitionDocketEntry });
  } else {
    let userHasAccessToCase;
    if (caseEntity.leadDocketNumber) {
      const { consolidatedCases } = caseData;

      userHasAccessToCase = isUserPartOfGroup({
        consolidatedCases,
        userId: user.userId,
      });
    } else {
      userHasAccessToCase = await applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser({
          applicationContext,
          docketNumber: caseEntity.docketNumber,
          userId: user.userId,
        });
    }

    if (key.includes('.pdf')) {
      if (
        caseEntity.getCaseConfirmationGeneratedPdfFileName() !== key ||
        !userHasAccessToCase
      ) {
        throw new UnauthorizedError('Unauthorized');
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

      const isPublic = DocketEntry.isPublic(docketEntryEntity, {
        caseIsSealed: isSealedCase(caseEntity),
        rootDocument: DocketEntry.fetchRootDocument(
          docketEntryEntity,
          caseData.docketEntries,
        ),
        visibilityChangeDate: documentVisibilityChangeDate,
      });

      if (
        !DocketEntry.isDownloadable(docketEntryEntity, {
          isCourtUser: false,
          isPublic,
          userHasAccessToCase,
        })
      ) {
        throw new UnauthorizedError(UNAUTHORIZED_DOCUMENT_MESSAGE);
      }
    }
  }

  return applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
    applicationContext,
    key,
  });
};

const UNAUTHORIZED_DOCUMENT_MESSAGE =
  'Unauthorized to view document at this time.';

const handleInternalUser = ({
  docketEntryEntity,
  isPetitionsClerk,
  petitionDocketEntry,
}) => {
  const selectedIsStin =
    docketEntryEntity &&
    docketEntryEntity.documentType === INITIAL_DOCUMENT_TYPES.stin.documentType;

  const petitionIsServed =
    petitionDocketEntry && DocketEntry.isServed(petitionDocketEntry);

  if (selectedIsStin && (!isPetitionsClerk || petitionIsServed)) {
    throw new UnauthorizedError(
      'Unauthorized to view case documents at this time.',
    );
  }
};

const handleIrsSuperUser = ({
  docketEntryEntity,
  key,
  petitionDocketEntry,
}) => {
  if (petitionDocketEntry && !DocketEntry.isServed(petitionDocketEntry)) {
    throw new UnauthorizedError(
      'Unauthorized to view case documents until the petition has been served.',
    );
  }

  if (!docketEntryEntity) {
    throw new NotFoundError(`Docket entry ${key} was not found.`);
  }
  if (!docketEntryEntity.isFileAttached) {
    throw new NotFoundError(
      `Docket entry ${key} does not have an attached file.`,
    );
  }
};

const getUserRoles = user => {
  return {
    isInternalUser: User.isInternalUser(user.role),
    isIrsSuperuser: user.role === ROLES.irsSuperuser,
    isPetitionsClerk: user.role === ROLES.petitionsClerk,
  };
};
