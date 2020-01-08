const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { addCoverToPdf } = require('./addCoversheetInteractor');
const { Case } = require('../entities/cases/Case');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { Document } = require('../entities/Document');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * updatePetitionerInformationInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update
 * @param {object} providers.petitionDetails the petition details to update on the case
 * @returns {object} the updated case data
 */
exports.updatePetitionerInformationInteractor = async ({
  applicationContext,
  caseId,
  contactPrimary,
  contactSecondary,
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
    },
    { applicationContext },
  );

  const caseDetail = {
    ...caseEntity.toRawObject(),
    caseCaptionPostfix: Case.CASE_CAPTION_POSTFIX,
  };
  let caseNameToUse;
  const spousePartyTypes = [
    ContactFactory.PARTY_TYPES.petitionerSpouse,
    ContactFactory.PARTY_TYPES.petitionerDeceasedSpouse,
  ];

  if (spousePartyTypes.includes(caseEntity.partyType)) {
    caseNameToUse = caseEntity.contactPrimary.name;
  } else {
    caseNameToUse = Case.getCaseCaptionNames(caseEntity.caseCaption);
  }

  const createDocumentForChange = async ({
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
          name: caseNameToUse,
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
        additionalInfo: `for ${caseNameToUse}`,
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
      documentType: primaryChange,
      newData: contactPrimary,
      oldData: oldCase.contactPrimary,
    });
  }
  if (secondaryChange) {
    await createDocumentForChange({
      documentType: secondaryChange,
      newData: contactSecondary,
      oldData: oldCase.contactSecondary,
    });
  }

  if (!primaryChange && !secondaryChange) {
    return Promise.resolve(); // nothing to be done.
  }
  return await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });
};
