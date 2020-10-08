const {
  documentMeetsAgeRequirements,
} = require('../utilities/getFormattedCaseDetail');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { ROLES } = require('../entities/EntityConstants');
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

  if (!isInternalUser && !isIrsSuperuser) {
    const caseData = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      });

    const caseEntity = new Case(caseData, { applicationContext });

    if (key.includes('.pdf')) {
      if (caseEntity.getCaseConfirmationGeneratedPdfFileName() !== key) {
        throw new UnauthorizedError('Unauthorized');
      }
    } else {
      const selectedDocketEntry = caseData.docketEntries.find(
        document => document.docketEntryId === key,
      );

      const docketEntryEntity = caseEntity.getDocketEntryById({
        docketEntryId: key,
      });

      const documentIsAvailable = documentMeetsAgeRequirements(
        selectedDocketEntry,
      );

      if (!documentIsAvailable) {
        throw new UnauthorizedError(
          'Unauthorized to view document at this time',
        );
      }

      if (docketEntryEntity.isCourtIssued()) {
        if (!docketEntryEntity.servedAt) {
          throw new UnauthorizedError(
            'Unauthorized to view document at this time',
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

        if (!userAssociatedWithCase) {
          throw new UnauthorizedError('Unauthorized');
        }
      }
    }
  } else if (isIrsSuperuser) {
    const caseData = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      });

    const caseEntity = new Case(caseData, { applicationContext });

    const isPetitionServed = caseEntity.docketEntries.find(
      doc => doc.documentType === 'Petition',
    ).servedAt;

    if (!isPetitionServed) {
      throw new UnauthorizedError(
        'Unauthorized to view case documents at this time',
      );
    }
  }

  return applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
    applicationContext,
    key,
  });
};
