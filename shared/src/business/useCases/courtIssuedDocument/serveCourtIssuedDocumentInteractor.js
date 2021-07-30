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
const { DocketEntry } = require('../../entities/DocketEntry');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');

const completeWorkItem = async ({
  applicationContext,
  courtIssuedDocument,
  user,
  workItemToUpdate,
}) => {
  Object.assign(workItemToUpdate, {
    docketEntry: {
      ...courtIssuedDocument.validate().toRawObject(),
    },
  });

  workItemToUpdate.setAsCompleted({ message: 'completed', user });

  await applicationContext.getPersistenceGateway().updateWorkItem({
    applicationContext,
    workItemToUpdate: workItemToUpdate.validate().toRawObject(),
  });

  await applicationContext.getPersistenceGateway().putWorkItemInOutbox({
    applicationContext,
    workItem: workItemToUpdate.validate().toRawObject(),
  });
};

/**
 * serveCourtIssuedDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case containing the document to serve
 * @param {string} providers.docketEntryId the id of the docket entry to serve
 * @returns {object} the updated case after the document was served
 */
exports.serveCourtIssuedDocumentInteractor = async (
  applicationContext,
  { docketEntryId, docketNumber },
) => {
  const user = applicationContext.getCurrentUser();

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

  let caseEntity = new Case(caseToUpdate, { applicationContext });

  const courtIssuedDocument = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  if (!courtIssuedDocument) {
    throw new NotFoundError(`Docket entry ${docketEntryId} was not found.`);
  }
  if (courtIssuedDocument.servedAt) {
    throw new Error('Docket entry has already been served');
  }

  if (courtIssuedDocument.isPendingService) {
    throw new Error('Docket entry is already being served');
  } else {
    await applicationContext
      .getPersistenceGateway()
      .updateDocketEntryPendingServiceStatus({
        applicationContext,
        docketEntryId: courtIssuedDocument.docketEntryId,
        docketNumber: caseToUpdate.docketNumber,
        status: true,
      });
  }

  try {
    courtIssuedDocument.numberOfPages = await applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument({
        applicationContext,
        docketEntryId,
      });

    const docketEntry = caseEntity.getDocketEntryById({
      docketEntryId,
    });

    // Serve on all parties
    const servedParties = aggregatePartiesForService(caseEntity);

    courtIssuedDocument.setAsServed(servedParties.all);

    const { Body: pdfData } = await applicationContext
      .getStorageClient()
      .getObject({
        Bucket: applicationContext.environment.documentsBucketName,
        Key: docketEntryId,
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
      key: docketEntryId,
    });

    const workItemToUpdate = courtIssuedDocument.workItem;
    await completeWorkItem({
      applicationContext,
      courtIssuedDocument,
      user,
      workItemToUpdate,
    });

    const updatedDocketEntryEntity = new DocketEntry(
      {
        ...docketEntry,
        filingDate: createISODateString(),
        isOnDocketRecord: true,
      },
      { applicationContext },
    );

    updatedDocketEntryEntity.validate();

    caseEntity.updateDocketEntry(updatedDocketEntryEntity);

    caseEntity = await applicationContext
      .getUseCaseHelpers()
      .updateCaseAutomaticBlock({
        applicationContext,
        caseEntity,
      });

    if (
      ENTERED_AND_SERVED_EVENT_CODES.includes(courtIssuedDocument.eventCode)
    ) {
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
        docketEntryId: courtIssuedDocument.docketEntryId,
      });

    await applicationContext
      .getPersistenceGateway()
      .updateDocketEntryPendingServiceStatus({
        applicationContext,
        docketEntryId: courtIssuedDocument.docketEntryId,
        docketNumber: caseToUpdate.docketNumber,
        status: false,
      });

    return serviceResults;
  } catch (e) {
    await applicationContext
      .getPersistenceGateway()
      .updateDocketEntryPendingServiceStatus({
        applicationContext,
        docketEntryId: courtIssuedDocument.docketEntryId,
        docketNumber: caseToUpdate.docketNumber,
        status: false,
      });

    throw e;
  }
};
