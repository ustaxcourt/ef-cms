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
const { DOCKET_SECTION } = require('../../entities/EntityConstants');
const { DocketEntry } = require('../../entities/DocketEntry');
const { log } = require('winston');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');
const { omit } = require('lodash');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { WorkItem } = require('../../entities/WorkItem');

/**
 * fileAndServeCourtIssuedDocumentInteractor
 *
 * @param {Object} applicationContext the application context
 * @param {Object} providers the providers object
 * @param {String} providers.documentMeta the document metadata
 * @returns {Object} the url of the document that was served
 */
exports.fileAndServeCourtIssuedDocumentInteractor = async (
  applicationContext,
  { documentMeta },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  const hasPermission =
    (isAuthorized(authorizedUser, ROLE_PERMISSIONS.DOCKET_ENTRY) ||
      isAuthorized(
        authorizedUser,
        ROLE_PERMISSIONS.CREATE_ORDER_DOCKET_ENTRY,
      )) &&
    isAuthorized(authorizedUser, ROLE_PERMISSIONS.SERVE_DOCUMENT);

  if (!hasPermission) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { docketEntryId, docketNumbers, leadCaseDocketNumber } = documentMeta;

  const leadCaseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: leadCaseDocketNumber,
    });

  let leadCaseEntity = new Case(leadCaseToUpdate, { applicationContext });

  const leadDocketEntryOld = leadCaseEntity.getDocketEntryById({
    docketEntryId,
  });

  if (!leadDocketEntryOld) {
    throw new NotFoundError('Docket entry not found');
  }
  if (leadDocketEntryOld.servedAt) {
    throw new Error('Docket entry has already been served');
  }
  if (leadDocketEntryOld.isPendingService) {
    throw new Error('Docket entry is already being served');
  }

  // createDocketEntriesForConsolidatedCases({
  //   applicationContext,
  //   docketNumbers,
  //   leadCaseDocketNumber,
  //   leadDocketEntryOld,
  // });

  await stampAndPersistDocument({
    applicationContext,
    documentMeta,
    leadDocketEntryOld,
  });

  const servingDocumentPromises = docketNumbers.map(consolidatedDocketNumber =>
    fileAndServeDocumentOnOneCase({
      applicationContext,
      authorizedUser,
      consolidatedDocketNumber,
      docketEntryId,
      documentMeta,
      leadCaseDocketNumber,
      leadDocketEntryOld,
    }),
  );
  await Promise.all(servingDocumentPromises);
};

// const createDocketEntriesForConsolidatedCases = async ({
//   applicationContext,
//   docketNumbers,
//   leadCaseDocketNumber,
//   leadDocketEntryOld,
// }) => {
//   docketNumbers.forEach(async docketNumber => {
//     if (docketNumber === leadCaseDocketNumber) {
//       return;
//     }
//     // create docket entry for each consolidated case (as a direct and un-updated copy of the original lead docket entry)
//     const caseToUpdate = await applicationContext
//       .getPersistenceGateway()
//       .getCaseByDocketNumber({
//         applicationContext,
//         docketNumber,
//       });
//     const caseEntity = new Case(caseToUpdate, { applicationContext });

//     console.log('***caseEntity***', caseEntity);

//     // TODO: docketEntryId equates to S3 key, requires more investigation

//     /**
//      * **documentMeta**  {
//   eventCode: 'O',
//   documentType: 'Order',
//   documentTitle: '[Anything]',
//   scenario: 'Type A',
//   isOrder: true,
//   requiresSignature: true,
//   attachments: false,
//   freeText: 'Lunch Order',
//   date: null,
//   generatedDocumentTitle: 'Lunch Order',
//   serviceStamp: 'Served',
//   docketEntryId: '41052161-a258-485e-b2e4-6b3e0a295818',
//   docketNumbers: [ '103-22', '104-22', '105-22' ],
//   leadCaseDocketNumber: '103-22'
// }
//      */

//     const docketEntryEntity = new DocketEntry(
//       {
//         ...leadDocketEntryOld,
//       },
//       { applicationContext },
//     );

//     console.log('***docketEntryEntity***', docketEntryEntity);
//   });
// };

const stampAndPersistDocument = async ({
  applicationContext,
  documentMeta,
  leadDocketEntry,
}) => {
  const leadDocketEntryEntityForServiceStampOnly = new DocketEntry(
    {
      ...omit(leadDocketEntry, 'filedBy'),
      documentTitle: documentMeta.generatedDocumentTitle,
      documentType: documentMeta.documentType,
      eventCode: documentMeta.eventCode,
      servedAt: documentMeta.servedAt,
      serviceStamp: documentMeta.serviceStamp,
    },
    { applicationContext },
  );

  const { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: leadDocketEntryEntityForServiceStampOnly.docketEntryId,
    })
    .promise();

  let serviceStampType = 'Served';

  if (
    leadDocketEntryEntityForServiceStampOnly.documentType ===
    GENERIC_ORDER_DOCUMENT_TYPE
  ) {
    serviceStampType = leadDocketEntryEntityForServiceStampOnly.serviceStamp;
  } else if (
    ENTERED_AND_SERVED_EVENT_CODES.includes(
      leadDocketEntryEntityForServiceStampOnly.eventCode,
    )
  ) {
    serviceStampType = 'Entered and Served';
  }

  const serviceStampDate = formatDateString(
    leadDocketEntryEntityForServiceStampOnly.servedAt,
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
    key: leadDocketEntryEntityForServiceStampOnly.docketEntryId,
  });
};

const fileAndServeDocumentOnOneCase = async ({
  applicationContext,
  authorizedUser,
  consolidatedDocketNumber: docketNumber,
  docketEntryId,
  documentMeta,
  leadCaseDocketNumber,
  leadDocketEntryOld,
}) => {
  // TODO:
  // Create new docket entries for each consolidated case, but only update the docket entry for the lead case
  // Refactor paper service receipt to account for multiple cases being served at once
  //

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  let caseEntity = new Case(caseToUpdate, { applicationContext });

  // const docketEntry = caseEntity.getDocketEntryById({
  //   docketEntryId,
  // });
  //
  // if (!docketEntry) {
  //   throw new NotFoundError('Docket entry not found');
  // }
  // if (docketEntry.servedAt) {
  //   throw new Error('Docket entry has already been served');
  // }
  //
  // if (docketEntry.isPendingService) {
  //   throw new Error('Docket entry is already being served');
  // }

  if (leadCaseDocketNumber === caseToUpdate.docketNumber) {
    await applicationContext
      .getPersistenceGateway()
      .updateDocketEntryPendingServiceStatus({
        applicationContext,
        docketEntryId: leadDocketEntryOld.docketEntryId,
        docketNumber: leadCaseDocketNumber,
        status: true,
      });
  }

  try {
    const user = await applicationContext
      .getPersistenceGateway()
      .getUserById({ applicationContext, userId: authorizedUser.userId });

    const numberOfPages = await applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument({ applicationContext, docketEntryId });

    //TODO: This is where we need to split away from the lead case's docket entry

    // Serve on all parties
    const servedParties = aggregatePartiesForService(caseEntity);

    const docketEntryEntity = new DocketEntry(
      {
        ...omit(leadDocketEntryOld, 'filedBy'),
        attachments: documentMeta.attachments,
        date: documentMeta.date,
        docketNumber: caseToUpdate.docketNumber,
        documentTitle: documentMeta.generatedDocumentTitle,
        documentType: documentMeta.documentType,
        draftOrderState: null,
        editState: JSON.stringify(documentMeta),
        eventCode: documentMeta.eventCode,
        filingDate: createISODateString(),
        freeText: documentMeta.freeText,
        isDraft: false,
        isFileAttached: true,
        isOnDocketRecord: true,
        judge: documentMeta.judge,
        numberOfPages,
        scenario: documentMeta.scenario,
        serviceStamp: documentMeta.serviceStamp,
        userId: user.userId,
      },
      { applicationContext },
    );

    docketEntryEntity.setAsServed(servedParties.all).validate();

    if (!docketEntryEntity.workItem) {
      docketEntryEntity.workItem = new WorkItem(
        {
          assigneeId: null,
          assigneeName: null,
          associatedJudge: caseToUpdate.associatedJudge,
          caseStatus: caseToUpdate.status,
          caseTitle: Case.getCaseTitle(caseEntity.caseCaption),
          docketEntry: {
            ...docketEntryEntity.toRawObject(),
            createdAt: docketEntryEntity.createdAt,
          },
          docketNumber: caseToUpdate.docketNumber,
          docketNumberWithSuffix: caseToUpdate.docketNumberWithSuffix,
          hideFromPendingMessages: true,
          inProgress: true,
          section: DOCKET_SECTION,
          sentBy: user.name,
          sentByUserId: user.userId,
        },
        { applicationContext },
      );
    }

    docketEntryEntity.workItem.assignToUser({
      assigneeId: user.userId,
      assigneeName: user.name,
      section: user.section,
      sentBy: user.name,
      sentBySection: user.section,
      sentByUserId: user.userId,
    });

    docketEntryEntity.workItem.setAsCompleted({ message: 'completed', user });
    caseEntity.updateDocketEntry(docketEntryEntity);

    await applicationContext.getPersistenceGateway().saveWorkItem({
      applicationContext,
      workItem: docketEntryEntity.workItem.validate().toRawObject(),
    });

    await applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox({
      applicationContext,
      section: user.section,
      userId: user.userId,
      workItem: docketEntryEntity.workItem.validate().toRawObject(),
    });

    caseEntity = await applicationContext
      .getUseCaseHelpers()
      .updateCaseAutomaticBlock({
        applicationContext,
        caseEntity,
      });

    if (ENTERED_AND_SERVED_EVENT_CODES.includes(docketEntryEntity.eventCode)) {
      caseEntity.closeCase();

      await applicationContext
        .getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords({
          applicationContext,
          docketNumber: caseEntity.docketNumber,
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

    await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

    const serviceResults = await applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf({
        applicationContext,
        caseEntity,
        docketEntryId: docketEntryEntity.docketEntryId,
      });

    await applicationContext
      .getPersistenceGateway()
      .updateDocketEntryPendingServiceStatus({
        applicationContext,
        docketEntryId: docketEntry.docketEntryId,
        docketNumber: caseToUpdate.docketNumber,
        status: false,
      });

    return serviceResults;
  } catch (e) {
    await applicationContext
      .getPersistenceGateway()
      .updateDocketEntryPendingServiceStatus({
        applicationContext,
        docketEntryId: docketEntry.docketEntryId,
        docketNumber: caseToUpdate.docketNumber,
        status: false,
      });

    throw e;
  }
};
