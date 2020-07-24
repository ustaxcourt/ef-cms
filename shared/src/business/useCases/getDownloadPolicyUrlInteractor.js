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
 * @param {string} providers.documentId the id of the document
 * @returns {Array<string>} the filing type options based on user role
 */
exports.getDownloadPolicyUrlInteractor = async ({
  applicationContext,
  docketNumber,
  documentId,
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

    if (documentId.includes('.pdf')) {
      if (caseEntity.getCaseConfirmationGeneratedPdfFileName() !== documentId) {
        throw new UnauthorizedError('Unauthorized');
      }
    } else {
      const selectedDocument = caseData.documents.find(
        document => document.documentId === documentId,
      );

      const documentEntity = caseEntity.getDocumentById({ documentId });

      const documentIsAvailable = documentMeetsAgeRequirements(
        selectedDocument,
      );

      if (!documentIsAvailable) {
        throw new UnauthorizedError(
          'Unauthorized to view document at this time',
        );
      }

      if (documentEntity.isCourtIssued()) {
        if (!documentEntity.servedAt) {
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

    const isPetitionServed = caseEntity.documents.find(
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
    documentId,
  });
};
