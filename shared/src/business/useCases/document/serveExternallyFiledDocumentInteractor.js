const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { ALLOWLIST_FEATURE_FLAGS } = require('../../entities/EntityConstants');
const { Case } = require('../../entities/cases/Case');
const { DocketEntry } = require('../../entities/DocketEntry');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * serveExternallyFiledDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.consolidatedGroupDocketNumbers the consolidated group's docket numbers
 * @param {string} providers.docketNumber the docket number of the case containing the document to serve
 * @param {string} providers.docketEntryId the id of the docket entry to serve
 * @returns {object} the paper service pdf url
 */
exports.serveExternallyFiledDocumentInteractor = async (
  applicationContext,
  { consolidatedGroupDocketNumbers, docketEntryId, docketNumber },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.SERVE_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const isCaseConsolidationFeatureOn = await applicationContext
    .getUseCases()
    .getFeatureFlagValueInteractor(applicationContext, {
      featureFlag:
        ALLOWLIST_FEATURE_FLAGS.CONSOLIDATED_CASES_PROPAGATE_DOCKET_ENTRIES.key,
    });

  if (!isCaseConsolidationFeatureOn) {
    consolidatedGroupDocketNumbers = [docketNumber];
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });
  const caseEntity = new Case(caseToUpdate, { applicationContext });

  // TODO CHNAGE TO BETTER name
  let originalSubjectDocketEntry = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  if (originalSubjectDocketEntry.isPendingService) {
    throw new Error('Docket entry is already being served');
  }

  const { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: originalSubjectDocketEntry.docketEntryId,
    })
    .promise();

  const stampedPdf = await stampDocument({
    applicationContext,
    form,
    pdfData,
  });

  const numberOfPages = await applicationContext
    .getUseCaseHelpers()
    .countPagesInDocument({
      applicationContext,
      docketEntryId,
      documentBytes: pdfData,
    });

  await applicationContext
    .getPersistenceGateway()
    .updateDocketEntryPendingServiceStatus({
      applicationContext,
      docketEntryId: currentDocketEntry.docketEntryId,
      docketNumber: caseToUpdate.docketNumber,
      status: true,
    });

  let caseEntities = [];
  let serviceResults;

  try {
    for (const docketNumber of docketNumbers) {
      const caseToUpdate = await applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber({
          applicationContext,
          docketNumber,
        });

      caseEntities.push(new Case(caseToUpdate, { applicationContext }));
    }

    const filedDocumentPromises = caseEntities.map(caseEntity =>
      fileDocumentOnOneCase({
        applicationContext,
        caseEntity,
        form,
        numberOfPages,
        originalSubjectDocketEntry,
        user,
      }),
    );
    caseEntities = await Promise.all(filedDocumentPromises);

    serviceResults = await applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf({
        applicationContext,
        caseEntities,
        docketEntryId: originalSubjectDocketEntry.docketEntryId,
        stampedPdf,
      });
  } finally {
    for (const caseEntity of caseEntities) {
      try {
        await applicationContext
          .getPersistenceGateway()
          .updateDocketEntryPendingServiceStatus({
            applicationContext,
            docketEntryId: originalSubjectDocketEntry.docketEntryId,
            docketNumber: caseEntity.docketNumber,
            status: false,
          });
      } catch (e) {
        applicationContext.logger.error(
          `Encountered an exception trying to reset isPendingService on Docket Number ${caseEntity.docketNumber}.`,
          e,
        );
      }

      await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
        applicationContext,
        document: stampedPdf,
        key: originalSubjectDocketEntry.docketEntryId,
      });

      //check if success msg needed

      // try {
      //   const servedParties = aggregatePartiesForService(caseEntity);

      //   let caseEntities = [];

      //   //TODO sorry for ugly
      //   for (let docketNo of consolidatedGroupDocketNumbers) {
      //     const aCase = await applicationContext
      //       .getPersistenceGateway()
      //       .getCaseByDocketNumber({
      //         applicationContext,
      //         docketNumber: docketNo,
      //       });

      //     let aCaseEntity = new Case(aCase, { applicationContext });
      //     caseEntities.push(aCaseEntity);
      //   }

      //   let filedByFromLeadCase;
      //   let serviceResults;

      //   const filedDocumentPromises = caseEntities.map(async rawCase => {
      //     if (rawCase.docketNumber === rawCase.leadDocketNumber) {
      //       currentDocketEntry.setAsServed(servedParties.all).validate();
      //       currentDocketEntry.setAsProcessingStatusAsCompleted();
      //       filedByFromLeadCase = currentDocketEntry.filedBy;

      //       caseEntity.updateDocketEntry(currentDocketEntry);
      //     } else {
      //       // add a new docket entry rather than update it
      //       currentDocketEntry = new DocketEntry(
      //         {
      //           ...currentDocketEntry,
      //           docketEntryId: applicationContext.getUniqueId(),
      //         },
      //         { applicationContext },
      //       );

      //       caseEntity.addDocketEntry(currentDocketEntry);
      //     }

      //     if (filedByFromLeadCase) {
      //       currentDocketEntry.filedBy = filedByFromLeadCase;
      //     }

      //     const { Body: pdfData } = await applicationContext
      //       .getStorageClient()
      //       .getObject({
      //         Bucket: applicationContext.environment.documentsBucketName,
      //         Key: docketEntryId,
      //       })
      //       .promise();

      //     const { pdfData: servedDocWithCover } = await addCoverToPdf({
      //       applicationContext,
      //       caseEntity,
      //       docketEntryEntity: currentDocketEntry,
      //       pdfData,
      //     });

      //     await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      //       applicationContext,
      //       document: servedDocWithCover,
      //       key: docketEntryId,
      //     });

      //     const workItemToUpdate = currentDocketEntry.workItem;

      //     if (workItemToUpdate) {
      //       workItemToUpdate.setAsCompleted({
      //         message: 'completed',
      //         user,
      //       });

      //       workItemToUpdate.assignToUser({
      //         assigneeId: user.userId,
      //         assigneeName: user.name,
      //         section: user.section,
      //         sentBy: user.name,
      //         sentBySection: user.section,
      //         sentByUserId: user.userId,
      //       });

      //       await applicationContext
      //         .getPersistenceGateway()
      //         .saveWorkItemForDocketClerkFilingExternalDocument({
      //           applicationContext,
      //           workItem: workItemToUpdate.validate().toRawObject(),
      //         });
      //     }

      //     await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
      //       applicationContext,
      //       caseToUpdate: caseEntity,
      //     });

      //     serviceResults = await applicationContext
      //       .getUseCaseHelpers()
      //       .serveDocumentAndGetPaperServicePdf({
      //         applicationContext,
      //         caseEntities,
      //         docketEntryId: currentDocketEntry.docketEntryId,
      //       });

      //     await applicationContext
      //       .getPersistenceGateway()
      //       .updateDocketEntryPendingServiceStatus({
      //         applicationContext,
      //         docketEntryId: currentDocketEntry.docketEntryId,
      //         docketNumber: caseToUpdate.docketNumber,
      //         status: false,
      //       });
      //   });

      //   caseEntities = await Promise.all(filedDocumentPromises);

      //   console.log('21234234caseEntities', caseEntities);

      //   return serviceResults;
      // }

      // }catch (e) {
      //     await applicationContext
      //       .getPersistenceGateway()
      //       .updateDocketEntryPendingServiceStatus({
      //         applicationContext,
      //         docketEntryId: currentDocketEntry.docketEntryId,
      //         docketNumber: caseToUpdate.docketNumber,
      //         status: false,
      //       });

      //     throw e;
      //   }
    }
  }
};

const stampDocument = async ({ applicationContext, form, pdfData }) => {
  // use docket entry eventcode
  const servedAt = createISODateString();

  let serviceStampType = 'Served';

  if (form.documentType === GENERIC_ORDER_DOCUMENT_TYPE) {
    serviceStampType = form.serviceStamp;
  } else if (ENTERED_AND_SERVED_EVENT_CODES.includes(form.eventCode)) {
    serviceStampType = 'Entered and Served';
  }

  const serviceStampDate = formatDateString(servedAt, 'MMDDYY');

  return await applicationContext.getUseCaseHelpers().addServedStampToDocument({
    applicationContext,
    pdfData,
    serviceStampText: `${serviceStampType} ${serviceStampDate}`,
  });
};

const fileDocumentOnOneCase = async ({
  applicationContext,
  caseEntity,
  form,
  numberOfPages,
  originalSubjectDocketEntry,
  user,
}) => {
  const servedParties = aggregatePartiesForService(caseEntity);

  const docketEntryEntity = new DocketEntry(
    {
      ...omit(originalSubjectDocketEntry, 'filedBy'),
      attachments: form.attachments,
      date: form.date,
      docketNumber: caseEntity.docketNumber,
      documentTitle: form.generatedDocumentTitle,
      documentType: form.documentType,
      draftOrderState: null,
      editState: JSON.stringify({
        ...form,
        docketEntryId: originalSubjectDocketEntry.docketEntryId,
        docketNumber: caseEntity.docketNumber,
      }),
      eventCode: form.eventCode,
      filingDate: createISODateString(),
      freeText: form.freeText,
      isDraft: false,
      isFileAttached: true,
      isOnDocketRecord: true,
      judge: form.judge,
      numberOfPages,
      scenario: form.scenario,
      serviceStamp: form.serviceStamp,
      userId: user.userId,
    },
    { applicationContext },
  );

  docketEntryEntity.setAsServed(servedParties.all).validate();
  docketEntryEntity.setAsProcessingStatusAsCompleted();

  const isSubjectCase =
    originalSubjectDocketEntry.docketNumber === caseEntity.docketNumber;

  if (!docketEntryEntity.workItem || !isSubjectCase) {
    docketEntryEntity.workItem = new WorkItem(
      {
        assigneeId: null,
        assigneeName: null,
        associatedJudge: caseEntity.associatedJudge,
        caseStatus: caseEntity.status,
        caseTitle: Case.getCaseTitle(caseEntity.caseCaption),
        docketEntry: {
          ...docketEntryEntity.toRawObject(),
          createdAt: docketEntryEntity.createdAt,
        },
        docketNumber: caseEntity.docketNumber,
        docketNumberWithSuffix: caseEntity.docketNumberWithSuffix,
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

  if (
    caseEntity.docketEntries.some(
      docketEntry =>
        docketEntry.docketEntryId === docketEntryEntity.docketEntryId,
    )
  ) {
    caseEntity.updateDocketEntry(docketEntryEntity);
  } else {
    caseEntity.addDocketEntry(docketEntryEntity);
  }

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
    await closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
      applicationContext,
      caseEntity,
    });
  }

  const validRawCaseEntity = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

  return new Case(validRawCaseEntity, { applicationContext });
};
