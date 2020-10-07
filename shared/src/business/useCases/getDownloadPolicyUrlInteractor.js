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
const { UnauthorizedError } = require('../../errors/errors');
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

  const caseEntity = new Case(caseData, { applicationContext });

  const petitionDocketEntry = caseEntity.getPetitionDocketEntry();

  if (!isInternalUser && !isIrsSuperuser) {
    if (key.includes('.pdf')) {
      if (caseEntity.getCaseConfirmationGeneratedPdfFileName() !== key) {
        throw new UnauthorizedError('Unauthorized');
      }
    } else {
      const docketEntryEntity = caseEntity.getDocketEntryById({
        docketEntryId: key,
      });

      const selectedDocketEntry = caseData.docketEntries.find(
        document => document.docketEntryId === key,
      );

      const documentIsAvailable = documentMeetsAgeRequirements(
        selectedDocketEntry,
      );

      const selectedIsStin =
        selectedDocketEntry.documentType ===
        INITIAL_DOCUMENT_TYPES.stin.documentType;

      if (!documentIsAvailable) {
        throw new UnauthorizedError(
          'Unauthorized to view document at this time',
        );
      }

      const userAssociatedWithCase = await applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser({
          applicationContext,
          docketNumber: caseEntity.docketNumber,
          userId: user.userId,
        });

      if (docketEntryEntity.isCourtIssued()) {
        if (!docketEntryEntity.servedAt) {
          throw new UnauthorizedError(
            'Unauthorized to view document at this time',
          );
        } else if (
          docketEntryEntity.eventCode === STIPULATED_DECISION_EVENT_CODE &&
          !userAssociatedWithCase
        ) {
          throw new UnauthorizedError(
            'Unauthorized to view document at this time',
          );
        }
      } else if (selectedIsStin) {
        throw new UnauthorizedError(
          'Unauthorized to view document at this time',
        );
      } else {
        if (!userAssociatedWithCase) {
          throw new UnauthorizedError('Unauthorized');
        }
      }
    }
  } else if (isIrsSuperuser) {
    if (petitionDocketEntry && !petitionDocketEntry.servedAt) {
      throw new UnauthorizedError(
        'Unauthorized to view case documents at this time',
      );
    }
  } else if (isInternalUser) {
    const selectedDocketEntry = caseData.docketEntries.find(
      document => document.docketEntryId === key,
    );

    const selectedIsStin =
      selectedDocketEntry &&
      selectedDocketEntry.documentType ===
        INITIAL_DOCUMENT_TYPES.stin.documentType;

    if (isPetitionsClerk) {
      if (
        selectedIsStin &&
        petitionDocketEntry &&
        petitionDocketEntry.servedAt
      ) {
        throw new UnauthorizedError(
          'Unauthorized to view case documents at this time',
        );
      }
    } else {
      if (selectedIsStin) {
        throw new UnauthorizedError(
          'Unauthorized to view case documents at this time',
        );
      }
    }
  }

  return applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
    applicationContext,
    key,
  });
};
