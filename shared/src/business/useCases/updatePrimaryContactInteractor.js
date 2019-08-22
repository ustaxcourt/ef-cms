const { Case } = require('../entities/cases/Case');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { Document } = require('../entities/Document');
const { NotFoundError, UnauthorizedError } = require('../../errors/errors');

/**
 * updatePrimaryContactInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update the primary contact
 * @param {object} providers.contactInfo the contact info to update on the case
 * @returns {object} the updated case
 */
exports.updatePrimaryContactInteractor = async ({
  applicationContext,
  caseId,
  contactInfo,
}) => {
  const user = applicationContext.getCurrentUser();

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${caseId} was not found.`);
  }

  if (user.userId !== caseToUpdate.userId) {
    throw new UnauthorizedError('Unauthorized for update case contact');
  }

  const documentType = applicationContext
    .getUtilities()
    .getDocumentTypeForAddressChange({
      newData: contactInfo,
      oldData: caseToUpdate.contactPrimary,
    });

  const pdfContentHtml = applicationContext
    .getUtilities()
    .generateChangeOfAddressTemplate({
      caseDetail: {
        ...caseToUpdate,
        caseCaptionPostfix: Case.CASE_CAPTION_POSTFIX,
      },
      documentTitle: documentType,
      newData: contactInfo,
      oldData: caseToUpdate.contactPrimary,
    });

  caseToUpdate.contactPrimary = ContactFactory.createContacts({
    contactInfo: { primary: contactInfo },
    partyType: caseToUpdate.partyType,
  }).primary.toRawObject();

  const caseEntity = new Case(caseToUpdate);

  const docketRecordPdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor({
      applicationContext,
      contentHtml: pdfContentHtml,
      displayHeaderFooter: false,
      docketNumber: caseToUpdate.docketNumber,
      headerHtml: null,
    });

  const newDocumentId = applicationContext.getUniqueId();

  await applicationContext.getPersistenceGateway().saveDocument({
    applicationContext,
    document: docketRecordPdf,
    documentId: newDocumentId,
  });

  const changeOfAddressDocument = new Document({
    caseId,
    documentId: newDocumentId,
    documentType: documentType,
    processingStatus: 'complete',
    userId: user.userId,
  });

  caseEntity.addDocument(changeOfAddressDocument);

  const rawCase = caseEntity.validate().toRawObject();

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: rawCase,
  });

  return rawCase;
};
