const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  createISODateString,
  formatDateString,
} = require('../../utilities/DateHandler');
const {
  ENTERED_AND_SERVED_EVENT_CODES,
  GENERIC_ORDER_DOCUMENT_TYPE,
} = require('../../entities/courtIssuedDocument/CourtIssuedDocumentConstants');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const {
  saveFileAndGenerateUrl,
} = require('../../useCaseHelper/saveFileAndGenerateUrl');
const { addServedStampToDocument } = require('./addServedStampToDocument');
const { Case } = require('../../entities/cases/Case');
const { DocketRecord } = require('../../entities/DocketRecord');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');

const completeWorkItem = async ({
  applicationContext,
  courtIssuedDocument,
  user,
  workItemToUpdate,
}) => {
  Object.assign(workItemToUpdate, {
    document: {
      ...courtIssuedDocument.validate().toRawObject(),
    },
  });

  workItemToUpdate.setAsCompleted({ message: 'completed', user });

  await applicationContext.getPersistenceGateway().deleteWorkItemFromInbox({
    applicationContext,
    workItem: workItemToUpdate,
  });

  await applicationContext.getPersistenceGateway().putWorkItemInOutbox({
    applicationContext,
    workItem: workItemToUpdate.validate().toRawObject(),
  });
};

/**
 * serveCourtIssuedDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case containing the document to serve
 * @param {string} providers.documentId the document id of the signed stipulated decision document
 * @returns {object} the updated case after the document was served
 */
exports.serveCourtIssuedDocumentInteractor = async ({
  applicationContext,
  docketNumber,
  documentId,
}) => {
  const user = applicationContext.getCurrentUser();

  const { PDFDocument } = await applicationContext.getPdfLib();

  if (!isAuthorized(user, ROLE_PERMISSIONS.SERVE_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized for document service');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${docketNumber} was not found.`);
  }

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const courtIssuedDocument = caseEntity.getDocumentById({
    documentId,
  });

  if (!courtIssuedDocument) {
    throw new NotFoundError(`Document ${documentId} was not found.`);
  }

  courtIssuedDocument.numberOfPages = await applicationContext
    .getUseCaseHelpers()
    .countPagesInDocument({
      applicationContext,
      documentId,
    });

  const docketEntry = caseEntity.getDocketRecordByDocumentId(documentId);

  // Serve on all parties
  const servedParties = aggregatePartiesForService(caseEntity);

  courtIssuedDocument.setAsServed(servedParties.all);

  const { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: documentId,
    })
    .promise();

  let serviceStampType = 'Served';

  if (courtIssuedDocument.documentType === GENERIC_ORDER_DOCUMENT_TYPE) {
    serviceStampType = courtIssuedDocument.serviceStamp;
  } else if (
    ENTERED_AND_SERVED_EVENT_CODES.includes(courtIssuedDocument.eventCode)
  ) {
    serviceStampType = 'Entered and Served';
  }

  const serviceStampDate = formatDateString(
    courtIssuedDocument.servedAt,
    'MMDDYY',
  );

  const newPdfData = await addServedStampToDocument({
    applicationContext,
    pdfData,
    serviceStampText: `${serviceStampType} ${serviceStampDate}`,
  });

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: newPdfData,
    documentId,
  });

  const workItemToUpdate = courtIssuedDocument.getQCWorkItem();
  await completeWorkItem({
    applicationContext,
    courtIssuedDocument,
    user,
    workItemToUpdate,
  });

  const updatedDocketRecordEntity = new DocketRecord(
    {
      ...docketEntry,
      filingDate: createISODateString(),
    },
    { applicationContext },
  );
  updatedDocketRecordEntity.validate();

  caseEntity.updateDocketRecordEntry(updatedDocketRecordEntity);

  if (ENTERED_AND_SERVED_EVENT_CODES.includes(courtIssuedDocument.eventCode)) {
    caseEntity.closeCase();

    await applicationContext
      .getPersistenceGateway()
      .deleteCaseTrialSortMappingRecords({
        applicationContext,
        caseId: caseEntity.caseId,
      });

    if (caseEntity.trialSessionId) {
      const trialSession = await applicationContext
        .getPersistenceGateway()
        .getTrialSessionById({
          applicationContext,
          trialSessionId: caseEntity.trialSessionId,
        });

      const trialSessionEntity = new TrialSession(trialSession, {
        applicationContext,
      });

      if (trialSessionEntity.isCalendared) {
        trialSessionEntity.removeCaseFromCalendar({
          disposition: 'Status was changed to Closed',
          docketNumber,
        });
      } else {
        trialSessionEntity.deleteCaseFromCalendar({
          docketNumber: caseEntity.docketNumber,
        });
      }

      await applicationContext.getPersistenceGateway().updateTrialSession({
        applicationContext,
        trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
      });
    }
  }

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
    applicationContext,
    caseEntity,
    documentEntity: courtIssuedDocument,
    servedParties,
  });

  if (servedParties.paper.length > 0) {
    const courtIssuedOrderDoc = await PDFDocument.load(newPdfData);

    let newPdfDoc = await PDFDocument.create();

    await applicationContext
      .getUseCaseHelpers()
      .appendPaperServiceAddressPageToPdf({
        applicationContext,
        caseEntity,
        newPdfDoc,
        noticeDoc: courtIssuedOrderDoc,
        servedParties,
      });

    const paperServicePdfData = await newPdfDoc.save();
    const { url } = await saveFileAndGenerateUrl({
      applicationContext,
      file: paperServicePdfData,
      useTempBucket: true,
    });

    return { pdfUrl: url };
  }
};
