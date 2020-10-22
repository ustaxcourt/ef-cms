const {
  documentMeetsAgeRequirements,
} = require('../utilities/getFormattedCaseDetail');
const {
  INITIAL_DOCUMENT_TYPES,
  ROLES,
  STIPULATED_DECISION_EVENT_CODE,
} = require('../entities/EntityConstants');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { NotFoundError, UnauthorizedError } = require('../../errors/errors');
const { User } = require('../entities/User');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case containing the document
 * @param {string} providers.key the key of the document
 * @returns {Array<string>} the filing type options based on user role
 */
exports.getDownloadPolicyUrlInteractor = async ({
  applicationContext,
  docketNumber,
  key,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.VIEW_DOCUMENTS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const isInternalUser = User.isInternalUser(user && user.role);
  const isIrsSuperuser = user && user.role && user.role === ROLES.irsSuperuser;
  const isPetitionsClerk =
    user && user.role && user.role === ROLES.petitionsClerk;

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
    const selectedIsStin =
      docketEntryEntity &&
      docketEntryEntity.documentType ===
        INITIAL_DOCUMENT_TYPES.stin.documentType;

    if (isPetitionsClerk) {
      if (
        selectedIsStin &&
        petitionDocketEntry &&
        petitionDocketEntry.servedAt
      ) {
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
  } else if (isIrsSuperuser) {
    if (petitionDocketEntry && !petitionDocketEntry.servedAt) {
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

      const documentIsAvailable = documentMeetsAgeRequirements(
        docketEntryEntity,
      );

      const selectedIsStin =
        docketEntryEntity.documentType ===
        INITIAL_DOCUMENT_TYPES.stin.documentType;

      if (!documentIsAvailable) {
        throw new UnauthorizedError(
          'Unauthorized to view document at this time.',
        );
      }

      if (docketEntryEntity.isCourtIssued()) {
        if (!docketEntryEntity.servedAt) {
          throw new UnauthorizedError(
            'Unauthorized to view document at this time.',
          );
        } else if (
          docketEntryEntity.eventCode === STIPULATED_DECISION_EVENT_CODE &&
          !userAssociatedWithCase
        ) {
          throw new UnauthorizedError(
            'Unauthorized to view document at this time.',
          );
        }
      } else if (selectedIsStin) {
        throw new UnauthorizedError(
          'Unauthorized to view document at this time.',
        );
      } else {
        if (!userAssociatedWithCase) {
          throw new UnauthorizedError('Unauthorized');
        }
      }
    }
  }

  return applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
    applicationContext,
    key,
  });
};
