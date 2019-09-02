const {
  addCoverToPdf,
} = require('../../../business/useCases/addCoverToPDFDocumentInteractor');
const {
  isAuthorized,
  UPDATE_CONTACT_INFO,
} = require('../../../authorization/authorizationClientService');
const { capitalize, clone } = require('lodash');
const { Case } = require('../../entities/cases/Case');
const { DOCKET_SECTION } = require('../../entities/WorkQueue');
const { Document } = require('../../entities/Document');
const { Message } = require('../../entities/Message');
const { UnauthorizedError } = require('../../../errors/errors');
const { WorkItem } = require('../../entities/WorkItem');

/**
 * updateUserContactInformationInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.contactInfo the contactInfo to update the contact info
 * @param {string} providers.userId the userId to update the contact info
 * @returns {Promise} an object is successful
 */
exports.updateUserContactInformationInteractor = async ({
  applicationContext,
  contactInfo,
  userId,
}) => {
  const authenticatedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authenticatedUser, UPDATE_CONTACT_INFO)) {
    throw new UnauthorizedError('Unauthorized');
  }

  if (authenticatedUser.userId !== userId) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId });

  await applicationContext.getPersistenceGateway().updateUser({
    applicationContext,
    user: {
      ...user,
      contact: contactInfo,
    },
  });

  const userCases = await applicationContext
    .getPersistenceGateway()
    .getCasesByUser({
      applicationContext,
      userId,
    });

  const updatedCases = await Promise.all(
    userCases.map(async userCase => {
      let oldData;
      const newData = contactInfo;
      const caseEntity = new Case(userCase);

      const practitioner = caseEntity.practitioners.find(
        practitioner => practitioner.userId === userId,
      );
      if (practitioner) {
        oldData = clone(practitioner.contact);
        Object.assign(practitioner.contact, contactInfo);
      }

      const respondent = caseEntity.respondents.find(
        respondent => respondent.userId === userId,
      );
      if (respondent) {
        oldData = clone(respondent.contact);
        Object.assign(respondent.contact, contactInfo);
      }

      const rawCase = caseEntity.validate().toRawObject();

      const caseDetail = {
        ...rawCase,
        caseCaptionPostfix: Case.CASE_CAPTION_POSTFIX,
      };

      const documentType = applicationContext
        .getUtilities()
        .getDocumentTypeForAddressChange({
          newData,
          oldData,
        });

      const pdfContentHtml = applicationContext
        .getTemplateGenerators()
        .generateChangeOfAddressTemplate({
          caption: caseDetail.caseCaption,
          captionPostfix: caseDetail.caseCaptionPostfix,
          docketNumberWithSuffix: `${
            caseDetail.docketNumber
          }${caseDetail.docketNumberSuffix || ''}`,
          documentTitle: documentType.title,
          name: user.name,
          newData,
          oldData,
        });

      const docketRecordPdf = await applicationContext
        .getUseCases()
        .generatePdfFromHtmlInteractor({
          applicationContext,
          contentHtml: pdfContentHtml,
          displayHeaderFooter: false,
          docketNumber: caseDetail.docketNumber,
        });

      const newDocumentId = applicationContext.getUniqueId();

      const changeOfAddressDocument = new Document({
        additionalInfo2: `for ${user.name}`,
        caseId: caseEntity.caseId,
        documentId: newDocumentId,
        documentType: documentType.title,
        eventCode: documentType.eventCode,
        filedBy: user.name,
        processingStatus: 'complete',
        userId: user.userId,
      });

      const workItem = new WorkItem({
        assigneeId: null,
        assigneeName: null,
        caseId: caseEntity.caseId,
        caseStatus: caseEntity.status,
        docketNumber: caseEntity.docketNumber,
        docketNumberSuffix: caseEntity.docketNumberSuffix,
        document: {
          ...changeOfAddressDocument.toRawObject(),
          createdAt: changeOfAddressDocument.createdAt,
        },
        isInternal: false,
        section: DOCKET_SECTION,
        sentBy: user.userId,
      });

      const message = new Message(
        {
          from: user.name,
          fromUserId: user.userId,
          message: `${
            changeOfAddressDocument.documentType
          } filed by ${capitalize(user.role)} is ready for review.`,
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

      return applicationContext.getPersistenceGateway().updateCase({
        applicationContext,
        caseToUpdate: caseEntity.validate().toRawObject(),
      });
    }),
  );

  return updatedCases;
};
