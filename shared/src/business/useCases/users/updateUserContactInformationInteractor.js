const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  calculateISODate,
  createISODateString,
} = require('../../utilities/DateHandler');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { addCoverToPdf } = require('../addCoversheetInteractor');
const { capitalize, clone } = require('lodash');
const { Case } = require('../../entities/cases/Case');
const { DOCKET_SECTION } = require('../../entities/WorkQueue');
const { Document } = require('../../entities/Document');
const { isEqual } = require('lodash');
const { Message } = require('../../entities/Message');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');
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

  if (!isAuthorized(authenticatedUser, ROLE_PERMISSIONS.UPDATE_CONTACT_INFO)) {
    throw new UnauthorizedError('Unauthorized');
  }

  if (authenticatedUser.userId !== userId) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId });

  if (isEqual(user.contact, contactInfo)) {
    throw new Error('there were no changes found needing to be updated');
  }

  await applicationContext.getPersistenceGateway().updateUser({
    applicationContext,
    user: {
      ...user,
      contact: { ...contactInfo },
    },
  });

  const userCases = await applicationContext
    .getPersistenceGateway()
    .getCasesByUser({
      applicationContext,
      userId,
    });

  const updatedCases = [];
  for (let userCase of userCases) {
    let oldData;
    const newData = contactInfo;

    let caseEntity = new Case(userCase, { applicationContext });
    const privatePractitioner = caseEntity.privatePractitioners.find(
      practitioner => practitioner.userId === userId,
    );
    if (privatePractitioner) {
      oldData = clone(privatePractitioner.contact);
      privatePractitioner.contact = contactInfo;
    }

    const irsPractitioner = caseEntity.irsPractitioners.find(
      practitioner => practitioner.userId === userId,
    );
    if (irsPractitioner) {
      oldData = clone(irsPractitioner.contact);
      irsPractitioner.contact = contactInfo;
    }

    // we do this again so that it will convert '' to null
    caseEntity = new Case(caseEntity, { applicationContext });
    const rawCase = caseEntity.validate().toRawObject();

    const caseDetail = {
      ...rawCase,
      caseCaptionPostfix: Case.CASE_CAPTION_POSTFIX,
    };

    let closedMoreThan6Months;
    if (caseEntity.status === Case.STATUS_TYPES.closed) {
      const maxClosedDate = calculateISODate({
        dateString: caseEntity.closedDate,
        howMuch: 6,
        units: 'months',
      });
      const rightNow = createISODateString();
      closedMoreThan6Months = maxClosedDate <= rightNow;
    }

    const shouldGenerateNotice = caseEntity.status !== Case.STATUS_TYPES.closed;
    const shouldUpdateCase =
      !closedMoreThan6Months || caseEntity.status !== Case.STATUS_TYPES.closed;

    if (shouldGenerateNotice) {
      const documentType = applicationContext
        .getUtilities()
        .getDocumentTypeForAddressChange({
          newData,
          oldData,
        });

      const pdfContentHtml = await applicationContext
        .getTemplateGenerators()
        .generateChangeOfAddressTemplate({
          applicationContext,
          content: {
            caption: caseDetail.caseCaption,
            captionPostfix: caseDetail.caseCaptionPostfix,
            docketNumberWithSuffix: `${caseDetail.docketNumber}${
              caseDetail.docketNumberSuffix || ''
            }`,
            documentTitle: documentType.title,
            name: `${user.name} (${user.barNumber})`,
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
          docketNumber: caseDetail.docketNumber,
        });

      const newDocumentId = applicationContext.getUniqueId();

      const documentData = {
        addToCoversheet: true,
        additionalInfo: `for ${user.name}`,
        caseId: caseEntity.caseId,
        documentId: newDocumentId,
        documentTitle: documentType.title,
        documentType: documentType.title,
        eventCode: documentType.eventCode,
        processingStatus: 'complete',
        userId: user.userId,
      };

      if (user.role === User.ROLES.privatePractitioner) {
        documentData.privatePractitioners = [
          {
            name: user.name,
            partyPrivatePractitioner: true,
          },
        ];
      } else if (user.role === User.ROLES.irsPractitioner) {
        documentData.partyIrsPractitioner = true;
      }

      const changeOfAddressDocument = new Document(documentData, {
        applicationContext,
      });

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
          caseId: caseEntity.caseId,
          caseIsInProgress: caseEntity.inProgress,
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
          message: `${
            changeOfAddressDocument.documentType
          } filed by ${capitalize(user.role)} is ready for review.`,
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
    }

    if (shouldUpdateCase) {
      const updatedCase = await applicationContext
        .getPersistenceGateway()
        .updateCase({
          applicationContext,
          caseToUpdate: caseEntity.validate().toRawObject(),
        });

      const updatedCaseRaw = new Case(updatedCase, { applicationContext })
        .validate()
        .toRawObject();
      updatedCases.push(updatedCaseRaw);
    }
  }

  return updatedCases;
};
