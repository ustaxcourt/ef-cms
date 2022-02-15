const {
  documentMeetsAgeRequirements,
} = require('../utilities/getFormattedCaseDetail');
const {
  INITIAL_DOCUMENT_TYPES,
  ROLES,
  STIPULATED_DECISION_EVENT_CODE,
  UNSERVABLE_EVENT_CODES,
} = require('../entities/EntityConstants');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { isServed } = require('../entities/DocketEntry');
const { NotFoundError, UnauthorizedError } = require('../../errors/errors');
const { User } = require('../entities/User');

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
    throw new UnauthorizedError('Unauthorized to view document at this time.');
  } else if (
    docketEntryEntity.eventCode === STIPULATED_DECISION_EVENT_CODE &&
    !userAssociatedWithCase
  ) {
    throw new UnauthorizedError('Unauthorized to view document at this time.');
  } else if (docketEntryEntity.isStricken) {
    throw new UnauthorizedError('Unauthorized to view document at this time.');
  } else if (docketEntryEntity.isLegacySealed) {
    throw new UnauthorizedError('Unauthorized to view document at this time.');
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
exports.getDownloadPolicyUrlInteractor = async (
  applicationContext,
  { docketNumber, key },
) => {
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
    const userAssociatedWithCase = await applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser({
        applicationContext,
        docketNumber: caseEntity.docketNumber,
        userId: user.userId,
      });

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

      const selectedIsStin =
        docketEntryEntity.documentType ===
        INITIAL_DOCUMENT_TYPES.stin.documentType;

      if (!documentIsAvailable) {
        throw new UnauthorizedError(
          'Unauthorized to view document at this time.',
        );
      }

      const unAuthorizedToViewNonCourtIssued =
        selectedIsStin ||
        !userAssociatedWithCase ||
        docketEntryEntity.isLegacySealed;

      if (docketEntryEntity.isCourtIssued()) {
        handleCourtIssued({ docketEntryEntity, userAssociatedWithCase });
      } else if (unAuthorizedToViewNonCourtIssued) {
        throw new UnauthorizedError(
          'Unauthorized to view document at this time.',
        );
      }
    }
  }

  return applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
    applicationContext,
    key,
  });
};
