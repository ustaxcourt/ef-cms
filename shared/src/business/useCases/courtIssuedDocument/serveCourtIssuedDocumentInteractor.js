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
const { addServedStampToDocument } = require('./addServedStampToDocument');
const { Case } = require('../../entities/cases/Case');
const { DocketRecord } = require('../../entities/DocketRecord');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');
const { PDFDocument } = require('pdf-lib');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');

const completeWorkItem = async ({
  applicationContext,
  courtIssuedDocument,
  user,
  workItemToUpdate,
}) => {
  Object.assign(workItemToUpdate, {
    document: {
      ...courtIssuedDocument.toRawObject(),
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
 * @param {string} providers.caseId the case id of the case containing the document to serve
 * @param {string} providers.documentId the document id of the signed stipulated decision document
 * @returns {object} the updated case after the document was served
 */

exports.serveCourtIssuedDocumentInteractor = async ({
  applicationContext,
  caseId,
  documentId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.SERVE_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized for document service');
  }

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

  const courtIssuedDocument = caseEntity.getDocumentById({
    documentId,
  });

  if (!courtIssuedDocument) {
    throw new NotFoundError(`Document ${documentId} was not found.`);
  }

  const docketEntry = caseEntity.docketRecord.find(
    entry => entry.documentId === documentId,
  );

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
    pdfData,
    serviceStampText: `${serviceStampType} ${serviceStampDate}`,
  });

  applicationContext.logger.time('Saving S3 Document');
  await applicationContext
    .getPersistenceGateway()
    .saveDocument({ applicationContext, document: newPdfData, documentId });
  applicationContext.logger.timeEnd('Saving S3 Document');

  const workItemToUpdate = courtIssuedDocument.getQCWorkItem();
  await completeWorkItem({
    applicationContext,
    courtIssuedDocument,
    user,
    workItemToUpdate,
  });

  const updatedDocketRecordEntity = new DocketRecord({
    ...docketEntry,
    filingDate: createISODateString(),
  });
  updatedDocketRecordEntity.validate();

  caseEntity.updateDocketRecordEntry(updatedDocketRecordEntity);

  if (ENTERED_AND_SERVED_EVENT_CODES.includes(courtIssuedDocument.eventCode)) {
    caseEntity.closeCase();

    await applicationContext
      .getPersistenceGateway()
      .deleteCaseTrialSortMappingRecords({
        applicationContext,
        caseId,
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
          caseId,
          disposition: 'Status was changed to Closed',
        });
      } else {
        trialSessionEntity.deleteCaseFromCalendar({ caseId });
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

  const destinations = servedParties.electronic.map(party => ({
    email: party.email,
    templateData: {
      caseCaption: caseToUpdate.caseCaption,
      docketNumber: caseToUpdate.docketNumber,
      documentName: courtIssuedDocument.documentTitle,
      loginUrl: `https://ui-${process.env.STAGE}.${process.env.EFCMS_DOMAIN}`,
      name: party.name,
      serviceDate: formatDateString(courtIssuedDocument.servedAt, 'MMDDYYYY'),
      serviceTime: formatDateString(courtIssuedDocument.servedAt, 'TIME'),
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

  let paperServicePdfBuffer;
  if (servedParties.paper.length > 0) {
    let paperServicePdfData = pdfData;
    const courtIssuedOrderDoc = await PDFDocument.load(pdfData);
    const addressPages = [];
    let newPdfDoc = await PDFDocument.create();

    for (let party of servedParties.paper) {
      addressPages.push(
        await applicationContext
          .getUseCaseHelpers()
          .generatePaperServiceAddressPagePdf({
            applicationContext,
            contactData: party,
            docketNumberWithSuffix: `${
              caseToUpdate.docketNumber
            }${caseToUpdate.docketNumberSuffix || ''}`,
          }),
      );
    }

    for (let addressPage of addressPages) {
      const addressPageDoc = await PDFDocument.load(addressPage);
      let copiedPages = await newPdfDoc.copyPages(
        addressPageDoc,
        addressPageDoc.getPageIndices(),
      );
      copiedPages.forEach(page => {
        newPdfDoc.addPage(page);
      });

      copiedPages = await newPdfDoc.copyPages(
        courtIssuedOrderDoc,
        courtIssuedOrderDoc.getPageIndices(),
      );
      copiedPages.forEach(page => {
        newPdfDoc.addPage(page);
      });
    }

    paperServicePdfData = await newPdfDoc.save();
    paperServicePdfBuffer = Buffer.from(paperServicePdfData);
  }

  return paperServicePdfBuffer;
};
