const {
  aggregatePartiesForService,
} = require('../utilities/aggregatePartiesForService');
const { addCoverToPdf } = require('./addCoversheetInteractor');
const { capitalize } = require('lodash');
const { Case } = require('../entities/cases/Case');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { DOCKET_SECTION } = require('../entities/WorkQueue');
const { Document } = require('../entities/Document');
const { formatDateString } = require('../utilities/DateHandler');
const { Message } = require('../entities/Message');
const { NotFoundError, UnauthorizedError } = require('../../errors/errors');
const { WorkItem } = require('../entities/WorkItem');

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

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const userIsAssociated = applicationContext
    .getUseCases()
    .userIsAssociated({ applicationContext, caseDetail: caseToUpdate, user });

  if (!userIsAssociated) {
    throw new UnauthorizedError('Unauthorized for update case contact');
  }

  const documentType = applicationContext
    .getUtilities()
    .getDocumentTypeForAddressChange({
      newData: contactInfo,
      oldData: caseEntity.contactPrimary,
    });

  const caseDetail = {
    ...caseEntity.toRawObject(),
    caseCaptionPostfix: Case.CASE_CAPTION_POSTFIX,
  };

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
        name: contactInfo.name,
        newData: contactInfo,
        oldData: caseEntity.contactPrimary,
      },
    });
  caseEntity.contactPrimary = ContactFactory.createContacts({
    contactInfo: { primary: contactInfo },
    partyType: caseEntity.partyType,
  }).primary.toRawObject();

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
      additionalInfo: `for ${contactInfo.name}`,
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

  const servedParties = aggregatePartiesForService(caseEntity);

  changeOfAddressDocument.setAsServed(servedParties.all);

  const destinations = servedParties.electronic.map(party => ({
    email: party.email,
    templateData: {
      caseCaption: caseEntity.caseCaption,
      docketNumber: caseEntity.docketNumber,
      documentName: changeOfAddressDocument.documentTitle,
      loginUrl: `https://ui-${process.env.STAGE}.${process.env.EFCMS_DOMAIN}`,
      name: party.name,
      serviceDate: formatDateString(
        changeOfAddressDocument.servedAt,
        'MMDDYYYY',
      ),
      serviceTime: formatDateString(changeOfAddressDocument.servedAt, 'TIME'),
    },
  }));

  if (destinations.length > 0) {
    await applicationContext.getDispatchers().sendBulkTemplatedEmail({
      applicationContext,
      defaultTemplateData: {
        caseCaption: 'undefined',
        docketNumber: 'undefined',
        documentName: 'undefined',
        loginUrl: 'undefined',
        name: 'undefined',
        serviceDate: 'undefined',
        serviceTime: 'undefined',
      },
      destinations,
      templateName: process.env.EMAIL_SERVED_TEMPLATE,
    });
  }

  const workItem = new WorkItem(
    {
      assigneeId: null,
      assigneeName: null,
      caseId,
      caseStatus: caseEntity.status,
      caseTitle: Case.getCaseCaptionNames(Case.getCaseCaption(caseEntity)),
      docketNumber: caseEntity.docketNumber,
      docketNumberSuffix: caseEntity.docketNumberSuffix,
      document: {
        ...changeOfAddressDocument.toRawObject(),
        createdAt: changeOfAddressDocument.createdAt,
      },
      isQC: true,
      section: DOCKET_SECTION,
      sentBy: user.userId,
    },
    { applicationContext },
  );

  const message = new Message(
    {
      from: user.name,
      fromUserId: user.userId,
      message: `${changeOfAddressDocument.documentType} filed by ${capitalize(
        user.role,
      )} is ready for review.`,
    },
    { applicationContext },
  );

  workItem.addMessage(message);
  changeOfAddressDocument.addWorkItem(workItem);

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

  await applicationContext.getPersistenceGateway().saveWorkItemForNonPaper({
    applicationContext,
    workItem: workItem,
  });

  const rawCase = caseEntity.validate().toRawObject();

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: rawCase,
  });

  return rawCase;
};
