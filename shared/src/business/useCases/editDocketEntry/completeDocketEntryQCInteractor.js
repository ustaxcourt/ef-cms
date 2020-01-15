const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  formatDocument,
  getFilingsAndProceedings,
} = require('../../utilities/getFormattedCaseDetail');
const {
  generateNoticeOfDocketChangePdf,
} = require('../../useCaseHelper/noticeOfDocketChange/generateNoticeOfDocketChangePdf');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { createISODateString } = require('../../utilities/DateHandler');
const { DOCKET_SECTION } = require('../../entities/WorkQueue');
const { DocketRecord } = require('../../entities/DocketRecord');
const { Document } = require('../../entities/Document');
const { omit } = require('lodash');
const { PDFDocument } = require('pdf-lib');
const { replaceBracketed } = require('../../utilities/replaceBracketed');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * completeDocketEntryQCInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.entryMetadata the entry metadata
 * @returns {object} the updated case after the documents are added
 */
exports.completeDocketEntryQCInteractor = async ({
  applicationContext,
  entryMetadata,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.DOCKET_ENTRY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { caseId, documentId, documentType } = entryMetadata;

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  let caseEntity = new Case(caseToUpdate, { applicationContext });
  const { index: docketRecordIndexUpdated } = caseEntity.docketRecord.find(
    record => record.documentId === documentId,
  );

  const currentDocument = caseEntity.getDocumentById({
    documentId,
  });

  const updatedDocument = new Document(
    {
      ...entryMetadata,
      createdAt: currentDocument.createdAt, // eslint-disable-line
      documentId,
      documentType,
      relationship: 'primaryDocument',
      userId: user.userId,
      workItems: currentDocument.workItems,
      ...caseEntity.getCaseContacts({
        contactPrimary: true,
        contactSecondary: true,
      }),
    },
    { applicationContext },
  ).validate();

  updatedDocument.generateFiledBy(caseToUpdate, true);
  updatedDocument.setQCed(user);

  let updatedDocumentTitle = updatedDocument.documentTitle;
  if (updatedDocument.additionalInfo) {
    updatedDocumentTitle += ` ${updatedDocument.additionalInfo}`;
  }
  updatedDocumentTitle += ` ${getFilingsAndProceedings(
    formatDocument(applicationContext, updatedDocument),
  )}`;
  if (updatedDocument.additionalInfo2) {
    updatedDocumentTitle += ` ${updatedDocument.additionalInfo2}`;
  }

  let currentDocumentTitle = currentDocument.documentTitle;
  if (currentDocument.additionalInfo) {
    currentDocumentTitle += ` ${currentDocument.additionalInfo}`;
  }
  currentDocumentTitle += ` ${getFilingsAndProceedings(
    formatDocument(applicationContext, currentDocument),
  )}`;
  if (currentDocument.additionalInfo2) {
    currentDocumentTitle += ` ${currentDocument.additionalInfo2}`;
  }

  const needsNewCoversheet =
    updatedDocument.additionalInfo !== currentDocument.additionalInfo ||
    updatedDocumentTitle !== currentDocumentTitle;

  const needsNoticeOfDocketChange =
    updatedDocument.filedBy !== currentDocument.filedBy ||
    updatedDocumentTitle !== currentDocumentTitle;

  const docketChangeInfo = {
    caseTitle: caseToUpdate.caseTitle,
    docketEntryIndex: docketRecordIndexUpdated,
    docketNumber: `${
      caseToUpdate.docketNumber
    }${caseToUpdate.docketNumberSuffix || ''}`,
    filingParties: {
      after: updatedDocument.filedBy,
      before: currentDocument.filedBy,
    },
    filingsAndProceedings: {
      after: updatedDocumentTitle,
      before: currentDocumentTitle,
    },
  };

  const docketRecordEntry = new DocketRecord({
    description: updatedDocumentTitle,
    documentId: updatedDocument.documentId,
    editState: '{}',
    filingDate: updatedDocument.receivedAt,
  });

  caseEntity.updateDocketRecordEntry(omit(docketRecordEntry, 'index'));
  caseEntity.updateDocument(updatedDocument);

  const workItemToUpdate = updatedDocument.getQCWorkItem();

  if (workItemToUpdate) {
    await applicationContext.getPersistenceGateway().deleteWorkItemFromInbox({
      applicationContext,
      workItem: workItemToUpdate,
    });

    Object.assign(workItemToUpdate, {
      caseId: caseId,
      caseStatus: caseToUpdate.status,
      docketNumber: caseToUpdate.docketNumber,
      docketNumberSuffix: caseToUpdate.docketNumberSuffix,
      document: {
        ...updatedDocument.toRawObject(),
        createdAt: updatedDocument.createdAt,
      },
    });

    if (!workItemToUpdate.completedAt) {
      Object.assign(workItemToUpdate, {
        assigneeId: null,
        assigneeName: null,
        section: DOCKET_SECTION,
        sentBy: user.userId,
      });

      workItemToUpdate.setAsCompleted({
        message: 'completed',
        user,
      });

      workItemToUpdate.assignToUser({
        assigneeId: user.userId,
        assigneeName: user.name,
        section: user.section,
        sentBy: user.name,
        sentBySection: user.section,
        sentByUserId: user.userId,
      });
    }

    await applicationContext
      .getPersistenceGateway()
      .saveWorkItemForDocketClerkFilingExternalDocument({
        applicationContext,
        workItem: workItemToUpdate.validate().toRawObject(),
      });
  }

  let servedParties = aggregatePartiesForService(caseEntity);
  let paperServicePdfUrl;

  if (
    Document.CONTACT_CHANGE_DOCUMENT_TYPES.includes(
      updatedDocument.documentType,
    )
  ) {
    if (servedParties.paper.length > 0) {
      const { Body: pdfData } = await applicationContext
        .getStorageClient()
        .getObject({
          Bucket: applicationContext.environment.documentsBucketName,
          Key: updatedDocument.documentId,
        })
        .promise();

      const noticeDoc = await PDFDocument.load(pdfData);
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
                caseEntity.docketNumber
              }${caseEntity.docketNumberSuffix || ''}`,
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
          noticeDoc,
          noticeDoc.getPageIndices(),
        );
        copiedPages.forEach(page => {
          newPdfDoc.addPage(page);
        });
      }

      const paperServicePdfData = await newPdfDoc.save();

      const paperServicePdfId = applicationContext.getUniqueId();

      applicationContext.logger.time('Saving S3 Document');
      await applicationContext.getPersistenceGateway().saveDocument({
        applicationContext,
        document: paperServicePdfData,
        documentId: paperServicePdfId,
        useTempBucket: true,
      });
      applicationContext.logger.timeEnd('Saving S3 Document');

      const {
        url,
      } = await applicationContext
        .getPersistenceGateway()
        .getDownloadPolicyUrl({
          applicationContext,
          documentId: paperServicePdfId,
          useTempBucket: true,
        });

      paperServicePdfUrl = url;
    }
  } else if (needsNoticeOfDocketChange) {
    const noticeDocumentId = await generateNoticeOfDocketChangePdf({
      applicationContext,
      docketChangeInfo,
    });

    let noticeUpdatedDocument = new Document(
      {
        ...Document.NOTICE_OF_DOCKET_CHANGE,
        documentId: noticeDocumentId,
        userId: user.userId,
      },
      { applicationContext },
    );

    noticeUpdatedDocument.documentTitle = replaceBracketed(
      Document.NOTICE_OF_DOCKET_CHANGE.documentTitle,
      docketChangeInfo.docketEntryIndex,
    );

    noticeUpdatedDocument.setAsServed(servedParties.all);

    const docketEntry = caseEntity.docketRecord.find(
      entry => entry.documentId === noticeUpdatedDocument.documentId,
    );

    const updatedDocketRecordEntity = new DocketRecord({
      ...docketEntry,
      filingDate: createISODateString(),
    });
    updatedDocketRecordEntity.validate();

    caseEntity.updateDocketRecordEntry(updatedDocketRecordEntity);

    caseEntity.addDocument(noticeUpdatedDocument);

    //serve the notice
    paperServicePdfUrl = await applicationContext
      .getUseCaseHelpers()
      .serveDocumentOnParties({
        applicationContext,
        caseEntity,
        documentEntity: noticeUpdatedDocument,
        servedParties,
      });
  }

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  if (needsNewCoversheet) {
    await applicationContext.getUseCases().addCoversheetInteractor({
      applicationContext,
      caseId,
      documentId,
    });
  }

  return {
    caseDetail: caseEntity.toRawObject(),
    paperServiceParties: servedParties.paper,
    paperServicePdfUrl,
  };
};
