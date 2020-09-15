const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const {
  TRANSCRIPT_EVENT_CODE,
  UNSERVABLE_EVENT_CODES,
} = require('../../entities/EntityConstants');
const { Case } = require('../../entities/cases/Case');
const { DOCKET_SECTION } = require('../../entities/EntityConstants');
const { DocketEntry } = require('../../entities/DocketEntry');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');
const { omit } = require('lodash');
const { WorkItem } = require('../../entities/WorkItem');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.documentMeta document details to go on the record
 * @returns {object} the updated case after the documents are added
 */
exports.fileCourtIssuedDocketEntryInteractor = async ({
  applicationContext,
  documentMeta,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  const hasPermission =
    isAuthorized(authorizedUser, ROLE_PERMISSIONS.DOCKET_ENTRY) ||
    isAuthorized(authorizedUser, ROLE_PERMISSIONS.CREATE_ORDER_DOCKET_ENTRY);

  if (!hasPermission) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { docketEntryId, docketNumber } = documentMeta;

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  let caseEntity = new Case(caseToUpdate, { applicationContext });

  const docketEntry = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  if (!docketEntry) {
    throw new NotFoundError('Docket entry not found');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  let secondaryDate;
  if (documentMeta.eventCode === TRANSCRIPT_EVENT_CODE) {
    secondaryDate = documentMeta.date;
  }

  const numberOfPages = await applicationContext
    .getUseCaseHelpers()
    .countPagesInDocument({ applicationContext, docketEntryId });

  const isUnservable = UNSERVABLE_EVENT_CODES.includes(documentMeta.eventCode);

  const docketEntryEntity = new DocketEntry(
    {
      ...omit(docketEntry, 'filedBy'),
      attachments: documentMeta.attachments,
      date: documentMeta.date,
      documentTitle: documentMeta.generatedDocumentTitle,
      documentType: documentMeta.documentType,
      editState: JSON.stringify(documentMeta),
      eventCode: documentMeta.eventCode,
      filedBy: undefined,
      freeText: documentMeta.freeText,
      isDraft: false,
      isFileAttached: true,
      isOnDocketRecord: true,
      judge: documentMeta.judge,
      numberOfPages,
      scenario: documentMeta.scenario,
      secondaryDate,
      serviceStamp: documentMeta.serviceStamp,
      userId: user.userId,
    },
    { applicationContext },
  );

  const workItem = new WorkItem(
    {
      assigneeId: null,
      assigneeName: null,
      associatedJudge: caseToUpdate.associatedJudge,
      caseIsInProgress: caseEntity.inProgress,
      caseStatus: caseToUpdate.status,
      caseTitle: Case.getCaseTitle(Case.getCaseCaption(caseEntity)),
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

  if (isUnservable) {
    workItem.setAsCompleted({ message: 'completed', user });
  }

  docketEntryEntity.setWorkItem(workItem);
  caseEntity.updateDocketEntry(docketEntryEntity);

  workItem.assignToUser({
    assigneeId: user.userId,
    assigneeName: user.name,
    section: user.section,
    sentBy: user.name,
    sentBySection: user.section,
    sentByUserId: user.userId,
  });

  caseEntity = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAutomaticBlock({
      applicationContext,
      caseEntity,
    });

  const saveItems = [
    applicationContext.getPersistenceGateway().updateCase({
      applicationContext,
      caseToUpdate: caseEntity.validate().toRawObject(),
    }),
  ];

  if (isUnservable) {
    saveItems.push(
      applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox({
        applicationContext,
        section: user.section,
        userId: user.userId,
        workItem: workItem.validate().toRawObject(),
      }),
    );
  } else {
    saveItems.push(
      applicationContext.getPersistenceGateway().createUserInboxRecord({
        applicationContext,
        workItem: workItem.validate().toRawObject(),
      }),
      applicationContext.getPersistenceGateway().createSectionInboxRecord({
        applicationContext,
        workItem: workItem.validate().toRawObject(),
      }),
    );
  }

  await Promise.all(saveItems);

  return caseEntity.toRawObject();
};
