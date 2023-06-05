import {
  ALLOWLIST_FEATURE_FLAGS,
  DOCKET_ENTRY_SEALED_TO_TYPES,
  INITIAL_DOCUMENT_TYPES,
  POLICY_DATE_IMPACTED_EVENTCODES,
  ROLES,
  UNSERVABLE_EVENT_CODES,
} from '../entities/EntityConstants';
import { Case, isUserPartOfGroup } from '../entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '../../errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { User } from '../entities/User';
import { documentMeetsAgeRequirements } from '../utilities/getFormattedCaseDetail';
import { isServed } from '../entities/DocketEntry';

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
  if (petitionDocketEntry && !isServed(petitionDocketEntry)) {
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
  const isUnservable = UNSERVABLE_EVENT_CODES.includes(
    docketEntryEntity.eventCode,
  );

  if (!isServed(docketEntryEntity) && !isUnservable) {
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

/**
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case containing the document
 * @param {string} providers.key the key of the document
 * @returns {Array<string>} the filing type options based on user role
 */
export const getDownloadPolicyUrlInteractor = async (
  applicationContext: IApplicationContext,
  { docketNumber, key }: { docketNumber: string; key: string },
) => {
  const isConsolidatedGroupAccessEnabled = await applicationContext
    .getUseCases()
    .getFeatureFlagValueInteractor(applicationContext, {
      featureFlag:
        ALLOWLIST_FEATURE_FLAGS.CONSOLIDATED_CASES_GROUP_ACCESS_PETITIONER.key,
    });

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
    if (isConsolidatedGroupAccessEnabled && caseEntity.leadDocketNumber) {
      const consolidatedCases = await applicationContext
        .getUseCases()
        .getConsolidatedCasesByCaseInteractor(applicationContext, {
          docketNumber: caseEntity.leadDocketNumber,
        });

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
        documentMeetsAgeRequirements(docketEntryEntity);

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

      if (docketEntryEntity.isCourtIssued()) {
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
