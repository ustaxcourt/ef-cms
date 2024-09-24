import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { DOCKET_SECTION } from '../../../../../shared/src/business/entities/EntityConstants';
import { DocketEntry } from '../../../../../shared/src/business/entities/DocketEntry';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { WorkItem } from '../../../../../shared/src/business/entities/WorkItem';
import { omit } from 'lodash';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';
import { saveWorkItem } from '@web-api/persistence/postgres/workitems/saveWorkItem';

/**
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.documentMeta document details to go on the record
 * @returns {object} the updated case after the documents are added
 */
export const fileCourtIssuedDocketEntry = async (
  applicationContext: ServerApplicationContext,
  {
    docketNumbers,
    documentMeta,
    subjectDocketNumber,
  }: {
    docketNumbers: string[];
    documentMeta: any;
    subjectDocketNumber: string;
  },
  authorizedUser: UnknownAuthUser,
) => {
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
    authorizedUser,
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

  const isUnservable = DocketEntry.isUnservable(documentMeta);

  await Promise.all(
    [subjectDocketNumber, ...docketNumbers].map(async docketNumber => {
      const caseToUpdate = await applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber({
          applicationContext,
          docketNumber,
        });

      let caseEntity = new Case(caseToUpdate, { authorizedUser });

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
        },
        { authorizedUser },
      );

      docketEntryEntity.setFiledBy(user);

      const workItem = new WorkItem(
        {
          assigneeId: null,
          assigneeName: null,
          associatedJudge: caseEntity.associatedJudge,
          associatedJudgeId: caseEntity.associatedJudgeId,
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
          trialDate: caseEntity.trialDate,
          trialLocation: caseEntity.trialLocation,
        },
        { caseEntity },
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

      const saveItems: Promise<any>[] = [
        applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
          applicationContext,
          authorizedUser,
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
          saveWorkItem({
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
    authorizedUser,
  }).validate();
  return subjectCase.toRawObject();
};

export const fileCourtIssuedDocketEntryInteractor = withLocking(
  fileCourtIssuedDocketEntry,
  (
    _applicationContext: ServerApplicationContext,
    { docketNumbers = [], subjectDocketNumber },
  ) => ({
    identifiers: [...new Set([subjectDocketNumber, ...docketNumbers])].map(
      item => `case|${item}`,
    ),
  }),
);
