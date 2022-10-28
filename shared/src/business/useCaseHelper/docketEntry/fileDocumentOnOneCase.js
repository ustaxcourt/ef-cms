const { DocketEntry } = require('../../entities/DocketEntry');
const { DOCKET_SECTION } = require('../../entities/EntityConstants');
const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');

exports.fileDocumentOnOneCase = async ({
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

  docketEntryEntity.workItem.leadDocketNumber = caseEntity.leadDocketNumber;

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

const closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments = async ({
  applicationContext,
  caseEntity,
}) => {
  caseEntity.closeCase();

  await applicationContext
    .getPersistenceGateway()
    .deleteCaseTrialSortMappingRecords({
      applicationContext,
      docketNumber: caseEntity.docketNumber,
    });

  if (!caseEntity.trialSessionId) {
    return;
  }

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
      docketNumber: caseEntity.docketNumber,
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
};
