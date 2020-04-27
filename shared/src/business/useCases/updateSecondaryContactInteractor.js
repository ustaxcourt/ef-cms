const {
  aggregatePartiesForService,
} = require('../utilities/aggregatePartiesForService');
const { addCoverToPdf } = require('./addCoversheetInteractor');
const { capitalize } = require('lodash');
const { Case } = require('../entities/cases/Case');
const { DOCKET_SECTION } = require('../entities/WorkQueue');
const { Document } = require('../entities/Document');
const { Message } = require('../entities/Message');
const { NotFoundError, UnauthorizedError } = require('../../errors/errors');
const { WorkItem } = require('../entities/WorkItem');

/**
 * updateSecondaryContactInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update the secondary contact
 * @param {object} providers.contactInfo the contact info to update on the case
 * @returns {object} the updated case
 */
exports.updateSecondaryContactInteractor = async ({
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

  if (caseToUpdate.contactSecondary) {
    contactInfo = {
      address1: contactInfo.address1,
      address2: contactInfo.address2,
      address3: contactInfo.address3,
      city: contactInfo.city,
      country: contactInfo.country,
      countryType: contactInfo.countryType,
      email: caseToUpdate.contactSecondary.email,
      name: caseToUpdate.contactSecondary.name,
      phone: contactInfo.phone,
      postalCode: contactInfo.postalCode,
    };
  }

  const caseEntity = new Case(
    { ...caseToUpdate, contactSecondary: contactInfo },
    { applicationContext },
  );

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
      oldData: caseToUpdate.contactSecondary,
    });

  if (documentType) {
    const pdfContentHtml = await applicationContext
      .getTemplateGenerators()
      .generateChangeOfAddressTemplate({
        applicationContext,
        content: {
          caption: caseEntity.caseCaption,
          docketNumberWithSuffix: `${caseEntity.docketNumber}${
            caseEntity.docketNumberSuffix || ''
          }`,
          documentTitle: documentType.title,
          name: contactInfo.name,
          newData: contactInfo,
          oldData: caseToUpdate.contactSecondary,
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
        additionalInfo: `for ${contactInfo.name}`,
        caseId,
        documentId: newDocumentId,
        documentTitle: documentType.title,
        documentType: documentType.title,
        eventCode: documentType.eventCode,
        partySecondary: true, // TODO: this was partyPrimary - but confirm what is _actually_ expected here.
        processingStatus: 'complete',
        userId: user.userId,
        ...caseEntity.getCaseContacts({
          contactSecondary: true,
        }),
      },
      { applicationContext },
    );

    const servedParties = aggregatePartiesForService(caseEntity);

    changeOfAddressDocument.setAsServed(servedParties.all);

    await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
      applicationContext,
      caseEntity,
      documentEntity: changeOfAddressDocument,
      servedParties,
    });

    const workItem = new WorkItem(
      {
        assigneeId: null,
        assigneeName: null,
        associatedJudge: caseEntity.associatedJudge,
        caseId,
        caseIsInProgress: caseEntity.inProgress,
        caseStatus: caseEntity.status,
        caseTitle: Case.getCaseTitle(Case.getCaseCaption(caseEntity)),
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

    caseEntity.addDocument(changeOfAddressDocument, { applicationContext });

    const docketRecordPdfWithCover = await addCoverToPdf({
      applicationContext,
      caseEntity,
      documentEntity: changeOfAddressDocument,
      pdfData: docketRecordPdf,
    });

    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: docketRecordPdfWithCover,
      documentId: newDocumentId,
    });

    await applicationContext.getPersistenceGateway().saveWorkItemForNonPaper({
      applicationContext,
      workItem: workItem,
    });

    await applicationContext.getPersistenceGateway().updateCase({
      applicationContext,
      caseToUpdate: caseEntity.validate().toRawObject(),
    });
  }

  return caseEntity.validate().toRawObject();
};
