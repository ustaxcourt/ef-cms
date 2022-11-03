const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  DOCKET_SECTION,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
} = require('../../entities/EntityConstants');
const {
  ENTERED_AND_SERVED_EVENT_CODES,
} = require('../../entities/courtIssuedDocument/CourtIssuedDocumentConstants');
const { Case } = require('../../entities/cases/Case');
const { DocketEntry } = require('../../entities/DocketEntry');
const { omit } = require('lodash');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { WorkItem } = require('../../entities/WorkItem');

exports.fileDocumentOnOneCase = async ({
  applicationContext,
  caseEntity,
  form,
  numberOfPages,
  originalSubjectDocketEntry,
  user,
}) => {
  const docketEntryEntity = new DocketEntry(
    {
      ...omit(originalSubjectDocketEntry, 'filedBy'),
      attachments: form.attachments,
      date: form.date,
      docketNumber: caseEntity.docketNumber,
      documentTitle: form.generatedDocumentTitle,
      documentType: form.documentType,
      editState: JSON.stringify({
        ...form,
        docketEntryId: originalSubjectDocketEntry.docketEntryId,
        docketNumber: caseEntity.docketNumber,
      }),
      eventCode: form.eventCode,
      freeText: form.freeText,
      isDraft: false,
      isFileAttached: true,
      isOnDocketRecord: true,
      judge: form.judge,
      numberOfPages,
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
      scenario: form.scenario,
      serviceStamp: form.serviceStamp,
      userId: user.userId,
    },
    { applicationContext },
  );

  const servedParties = aggregatePartiesForService(caseEntity);
  docketEntryEntity.setAsServed(servedParties.all).validate();

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
    caseEntity.getDocketEntryById({
      docketEntryId: docketEntryEntity.docketEntryId,
    })
  ) {
    caseEntity.updateDocketEntry(docketEntryEntity);
  } else {
    caseEntity.addDocketEntry(docketEntryEntity);
  }

  const validatedRawDocketEntry = docketEntryEntity.workItem
    .validate()
    .toRawObject();

  await applicationContext.getPersistenceGateway().saveWorkItem({
    applicationContext,
    workItem: validatedRawDocketEntry,
  });

  await applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox({
    applicationContext,
    section: user.section,
    userId: user.userId,
    workItem: validatedRawDocketEntry,
  });

  caseEntity = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAutomaticBlock({
      applicationContext,
      caseEntity,
    });

  if (ENTERED_AND_SERVED_EVENT_CODES.includes(docketEntryEntity.eventCode)) {
    await applicationContext
      .getUseCaseHelpers()
      .closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
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
