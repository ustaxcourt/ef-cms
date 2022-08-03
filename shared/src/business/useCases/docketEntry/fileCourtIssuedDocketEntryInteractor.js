const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { DOCKET_SECTION } = require('../../entities/EntityConstants');
const { DocketEntry } = require('../../entities/DocketEntry');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');
const { omit } = require('lodash');
const { UNSERVABLE_EVENT_CODES } = require('../../entities/EntityConstants');
const { WorkItem } = require('../../entities/WorkItem');

/**
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.documentMeta document details to go on the record
 * @returns {object} the updated case after the documents are added
 */
exports.fileCourtIssuedDocketEntryInteractor = async (
  applicationContext,
  { docketNumbers, documentMeta, subjectDocketNumber },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  const hasPermission =
    isAuthorized(authorizedUser, ROLE_PERMISSIONS.DOCKET_ENTRY) ||
    isAuthorized(authorizedUser, ROLE_PERMISSIONS.CREATE_ORDER_DOCKET_ENTRY);

  if (!hasPermission) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { docketEntryId } = documentMeta;

  const subjectCaseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: subjectDocketNumber,
    });

  let subjectCaseToUpdateEntity = new Case(subjectCaseToUpdate, {
    applicationContext,
  });

  const subjectDocketEntry = subjectCaseToUpdateEntity.getDocketEntryById({
    docketEntryId,
  });

  if (!subjectDocketEntry) {
    throw new NotFoundError('Docket entry not found');
  }

  if (subjectDocketEntry.isOnDocketRecord) {
    throw new Error('Docket entry has already been added to docket record');
  }

  const numberOfPages = await applicationContext
    .getUseCaseHelpers()
    .countPagesInDocument({ applicationContext, docketEntryId });

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const isUnservable = UNSERVABLE_EVENT_CODES.includes(documentMeta.eventCode);

  await Promise.all(
    docketNumbers.map(async docketNumber => {
      const caseToUpdate = await applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber({
          applicationContext,
          docketNumber,
        });

      let caseEntity = new Case(caseToUpdate, { applicationContext });

      const docketEntryEntity = new DocketEntry(
        {
          ...omit(subjectDocketEntry, 'filedBy'),
          attachments: documentMeta.attachments,
          date: documentMeta.date,
          docketNumber: caseEntity.docketNumber,
          documentTitle: documentMeta.generatedDocumentTitle,
          documentType: documentMeta.documentType,
          draftOrderState: null,
          editState: JSON.stringify({ ...documentMeta, docketNumber }),
          eventCode: documentMeta.eventCode,
          filingDate: documentMeta.filingDate,
          freeText: documentMeta.freeText,
          isDraft: false,
          isFileAttached: true,
          isOnDocketRecord: true,
          judge: documentMeta.judge,
          numberOfPages,
          scenario: documentMeta.scenario,
          serviceStamp: documentMeta.serviceStamp,
          trialLocation: documentMeta.trialLocation,
          userId: user.userId,
        },
        { applicationContext },
      );

      const workItem = new WorkItem(
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

      if (isUnservable) {
        workItem.setAsCompleted({ message: 'completed', user });
      }

      docketEntryEntity.setWorkItem(workItem);

      const isDocketEntryAlreadyOnCase = !!caseEntity.getDocketEntryById({
        docketEntryId,
      });

      if (!isDocketEntryAlreadyOnCase) {
        caseEntity.addDocketEntry(docketEntryEntity);
      } else {
        caseEntity.updateDocketEntry(docketEntryEntity);
      }

      workItem.assignToUser({
        assigneeId: user.userId,
        assigneeName: user.name,
        section: user.section,
        sentBy: user.name,
        sentBySection: user.section,
        sentByUserId: user.userId,
      });

      const saveItems = [
        applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
          applicationContext,
          caseToUpdate: caseEntity,
        }),
      ];

      const rawValidWorkItem = workItem.validate().toRawObject();
      if (isUnservable) {
        saveItems.push(
          applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox({
            applicationContext,
            section: user.section,
            userId: user.userId,
            workItem: rawValidWorkItem,
          }),
        );
      } else {
        saveItems.push(
          applicationContext.getPersistenceGateway().saveWorkItem({
            applicationContext,
            workItem: rawValidWorkItem,
          }),
        );
      }

      return Promise.all(saveItems);
    }),
  );

  const rawSubjectCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: subjectDocketNumber,
    });

  const subjectCase = new Case(rawSubjectCase, {
    applicationContext,
  }).validate();
  return subjectCase.toRawObject();
};
