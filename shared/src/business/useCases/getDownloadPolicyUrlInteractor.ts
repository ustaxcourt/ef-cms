import { Case, isUserPartOfGroup } from '../entities/cases/Case';
import {
  DOCKET_ENTRY_SEALED_TO_TYPES,
  INITIAL_DOCUMENT_TYPES,
  POLICY_DATE_IMPACTED_EVENTCODES,
  ROLES,
} from '../entities/EntityConstants';
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
    let userAssociatedWithCase;
    if (caseEntity.leadDocketNumber) {
      const { consolidatedCases } = caseData;

      userAssociatedWithCase = isUserPartOfGroup({
        consolidatedCases,
        userId: user.userId,
      });
    } else {
      userAssociatedWithCase = await applicationContext
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
        !userAssociatedWithCase
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

      const documentIsAvailable =
        DocketEntry.meetsAgeRequirements(docketEntryEntity);

      if (!documentIsAvailable) {
        throw new UnauthorizedError(UNAUTHORIZED_DOCUMENT_MESSAGE);
      }

      const selectedIsStin =
        docketEntryEntity.documentType ===
        INITIAL_DOCUMENT_TYPES.stin.documentType;
      const hasPolicyDateImpactedEventCode =
        POLICY_DATE_IMPACTED_EVENTCODES.includes(docketEntryEntity.eventCode);
      const unAuthorizedToViewNonCourtIssued =
        (selectedIsStin || !userAssociatedWithCase) &&
        !hasPolicyDateImpactedEventCode;

      if (DocketEntry.isCourtIssued(docketEntryEntity.eventCode)) {
        handleCourtIssued({ docketEntryEntity, userAssociatedWithCase });
      } else {
        if (
          docketEntryEntity.isSealed &&
          docketEntryEntity.sealedTo === DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL
        ) {
          throw new UnauthorizedError(UNAUTHORIZED_DOCUMENT_MESSAGE);
        } else if (unAuthorizedToViewNonCourtIssued) {
          throw new UnauthorizedError(UNAUTHORIZED_DOCUMENT_MESSAGE);
        }
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

  if (isPetitionsClerk) {
    if (selectedIsStin && petitionDocketEntry && petitionDocketEntry.servedAt) {
      throw new UnauthorizedError(
        'Unauthorized to view case documents at this time.',
      );
    }
  } else {
    if (selectedIsStin) {
      throw new UnauthorizedError(
        'Unauthorized to view case documents at this time.',
      );
    }
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

const handleCourtIssued = ({ docketEntryEntity, userAssociatedWithCase }) => {
  if (
    !DocketEntry.isServed(docketEntryEntity) &&
    !DocketEntry.isUnservable(docketEntryEntity)
  ) {
    throw new UnauthorizedError(UNAUTHORIZED_DOCUMENT_MESSAGE);
  } else if (docketEntryEntity.isStricken) {
    throw new UnauthorizedError(UNAUTHORIZED_DOCUMENT_MESSAGE);
  } else if (docketEntryEntity.isSealed) {
    if (
      docketEntryEntity.sealedTo === DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC &&
      !userAssociatedWithCase
    ) {
      throw new UnauthorizedError(UNAUTHORIZED_DOCUMENT_MESSAGE);
    } else if (
      docketEntryEntity.sealedTo === DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL
    ) {
      throw new UnauthorizedError(UNAUTHORIZED_DOCUMENT_MESSAGE);
    }
  }
};

const getUserRoles = user => {
  return {
    isInternalUser: User.isInternalUser(user.role),
    isIrsSuperuser: user.role === ROLES.irsSuperuser,
    isPetitionsClerk: user.role === ROLES.petitionsClerk,
  };
};
