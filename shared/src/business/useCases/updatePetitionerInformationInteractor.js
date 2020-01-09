const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { addCoverToPdf } = require('./addCoversheetInteractor');
const { Case } = require('../entities/cases/Case');
const { Document } = require('../entities/Document');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * updatePetitionerInformationInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update
 * @param {object} providers.contactPrimary the primary contact information to update on the case
 * @param {object} providers.contactSecondary the secondary contact information to update on the case
 * @param {object} providers.partyType the party type to update on the case
 * @returns {object} the updated case data
 */
exports.updatePetitionerInformationInteractor = async ({
  applicationContext,
  caseId,
  contactPrimary,
  contactSecondary,
  partyType,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.EDIT_PETITION_DETAILS)) {
    throw new UnauthorizedError('Unauthorized for editing petition details');
  }

  const oldCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({ applicationContext, caseId });

  const primaryChange = applicationContext
    .getUtilities()
    .getDocumentTypeForAddressChange({
      newData: contactPrimary,
      oldData: oldCase.contactPrimary,
    });

  const secondaryChange = contactSecondary
    ? applicationContext.getUtilities().getDocumentTypeForAddressChange({
        newData: contactSecondary,
        oldData: oldCase.contactSecondary || {},
      })
    : undefined;

  const caseEntity = new Case(
    {
      ...oldCase,
      contactPrimary,
      contactSecondary,
      partyType,
    },
    { applicationContext },
  );

  const caseDetail = {
    ...caseEntity.toRawObject(),
    caseCaptionPostfix: Case.CASE_CAPTION_POSTFIX,
  };

  const createDocumentForChange = async ({
    contactName,
    documentType,
    newData,
    oldData,
  }) => {
    const pdfContentHtml = await applicationContext
      .getTemplateGenerators()
      .generateChangeOfAddressTemplate({
        applicationContext,
        content: {
          caption: caseDetail.caseCaption,
          captionPostfix: caseDetail.caseCaptionPostfix,
          docketNumberWithSuffix: `${
            caseDetail.docketNumber
          }${caseDetail.docketNumberSuffix || ''}`,
          documentTitle: documentType.title,
          name: contactName,
          newData,
          oldData,
        },
      });
    const docketRecordPdf = await applicationContext
      .getUseCases()
      .generatePdfFromHtmlInteractor({
        applicationContext,
        contentHtml: pdfContentHtml,
        displayHeaderFooter: false,
        docketNumber: caseEntity.docketNumber,
        headerHtml: null,
      });
    const newDocumentId = applicationContext.getUniqueId();

    const changeOfAddressDocument = new Document(
      {
        addToCoversheet: true,
        additionalInfo: `for ${contactName}`,
        caseId,
        documentId: newDocumentId,
        documentType: documentType.title,
        eventCode: documentType.eventCode,
        filedBy: user.name,
        processingStatus: 'complete',
        userId: user.userId,
      },
      { applicationContext },
    );
    caseEntity.addDocument(changeOfAddressDocument);
    const docketRecordPdfWithCover = await addCoverToPdf({
      applicationContext,
      caseEntity,
      documentEntity: changeOfAddressDocument,
      pdfData: docketRecordPdf,
    });

    await applicationContext.getPersistenceGateway().saveDocument({
      applicationContext,
      document: docketRecordPdfWithCover,
      documentId: newDocumentId,
    });
  };

  if (primaryChange) {
    await createDocumentForChange({
      contactName: contactPrimary.name,
      documentType: primaryChange,
      newData: contactPrimary,
      oldData: oldCase.contactPrimary,
    });
  }
  if (secondaryChange) {
    await createDocumentForChange({
      contactName: contactSecondary.name,
      documentType: secondaryChange,
      newData: contactSecondary,
      oldData: oldCase.contactSecondary || {},
    });
  }

  return await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });
};
