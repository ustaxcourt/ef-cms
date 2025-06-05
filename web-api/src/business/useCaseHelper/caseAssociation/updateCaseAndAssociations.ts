import { Case } from '@shared/business/entities/cases/Case';
import { CaseDeadline } from '@shared/business/entities/CaseDeadline';
import { Correspondence } from '@shared/business/entities/Correspondence';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { Message } from '@shared/business/entities/Message';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { WorkItem } from '@shared/business/entities/WorkItem';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getMessagesByDocketNumber } from '@web-api/persistence/postgres/messages/getMessagesByDocketNumber';
import { getWorkItemsByDocketNumber } from '@web-api/persistence/postgres/workitems/getWorkItemsByDocketNumber';
import { updateMessage } from '@web-api/persistence/postgres/messages/updateMessage';
import { getCaseDeadlinesByDocketNumber } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { isEmpty } from 'lodash';
import { upsertCaseCorrespondences } from '@web-api/persistence/postgres/caseCorrespondences/upsertCaseCorrespondences';
import { upsertCaseDeadlines } from '@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadlines';
import { upsertWorkItems } from '@web-api/persistence/postgres/workitems/upsertWorkItems';
import diff from 'diff-arrays-of-objects';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';

/**
 * Identifies docket entries which have been updated and issues persistence calls
 * @param {object} args the arguments for updating the case
 * @param {object} args.applicationContext the application context
 * @param {object} args.caseToUpdate the case with its updated document data
 * @param {object} args.oldCase the case as it is currently stored in persistence, prior to these changes
 * @returns {Array<function>} the persistence functions required to complete this action
 */
const updateCaseDocketEntries = async ({
  applicationContext,
  authorizedUser,
  caseToUpdate,
  oldCase,
}: {
  applicationContext: ServerApplicationContext;
  authorizedUser: UnknownAuthUser;
  caseToUpdate: RawCase;
  oldCase: RawCase;
}) => {
  const { added: addedDocketEntries, updated: updatedDocketEntries } = diff(
    oldCase.docketEntries,
    caseToUpdate.docketEntries,
    'docketEntryId',
  );

  addedDocketEntries.forEach(d => {
    if (d.eventCode == 'EXH') {
      console.log('in updateCaseAndAssociations: added docket entry', d);
    }
  });

  updatedDocketEntries.forEach(d => {
    if (d.eventCode == 'EXH') {
      console.log('in updateCaseAndAssociations: updated docket entry', d);
    }
  });

  const {
    added: addedArchivedDocketEntries,
    updated: updatedArchivedDocketEntries,
  } = diff(
    oldCase.archivedDocketEntries,
    caseToUpdate.archivedDocketEntries,
    'docketEntryId',
  );

  const validDocketEntries = DocketEntry.validateRawCollection(
    [
      ...addedDocketEntries,
      ...updatedDocketEntries,
      ...addedArchivedDocketEntries,
      ...updatedArchivedDocketEntries,
    ],
    { authorizedUser, petitioners: caseToUpdate.petitioners },
  );

  validDocketEntries.forEach(d => {
    if (d.eventCode == 'EXH') {
      console.log('in updateCaseAndAssociations: valid docket entry', d);
    }
  });

  await settlePromises(
    validDocketEntries.map(doc =>
      applicationContext.getPersistenceGateway().updateDocketEntry({
        applicationContext,
        docketEntryId: doc.docketEntryId,
        docketNumber: caseToUpdate.docketNumber,
        document: doc,
      }),
    ),
  );
};

const updateCaseMessages = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applicationContext, // cannot remove till remaining RELATED_CASE_OPERATIONS functions no longer use applicationContext
  caseToUpdate,
  oldCase,
}: {
  applicationContext: ServerApplicationContext;
  caseToUpdate: RawCase;
  oldCase: RawCase;
}) => {
  const messageUpdatesNecessary =
    oldCase.docketNumberSuffix !== caseToUpdate.docketNumberSuffix;

  if (!messageUpdatesNecessary) {
    return [];
  }

  const caseMessages = await getMessagesByDocketNumber({
    docketNumber: caseToUpdate.docketNumber,
  });

  if (!caseMessages) {
    return [];
  }

  caseMessages.forEach(message => {
    message.docketNumberSuffix = caseToUpdate.docketNumberSuffix ?? undefined;
  });

  const validMessages = Message.validateRawCollection(caseMessages);

  await settlePromises(
    validMessages.map(message =>
      updateMessage({
        message,
      }),
    ),
  );
};

/**
 * Identifies correspondences which have been updated and issues persistence calls
 * @param {object} args the arguments for updating the case
 * @param {object} args.applicationContext the application context
 * @param {object} args.caseToUpdate the case with its updated correspondence data
 * @param {object} args.oldCase the case as it is currently stored in persistence, prior to these changes
 * @returns {Array<function>} the persistence functions required to complete this action
 */
const updateCorrespondence = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applicationContext,
  caseToUpdate,
  oldCase,
}: {
  applicationContext: ServerApplicationContext;
  caseToUpdate: RawCase;
  oldCase: RawCase;
}) => {
  const {
    added: addedArchivedCorrespondences,
    updated: updatedArchivedCorrespondences,
  } = diff(
    oldCase.archivedCorrespondences,
    caseToUpdate.archivedCorrespondences,
    'correspondenceId',
  );

  const { added: addedCorrespondences, updated: updatedCorrespondences } = diff(
    oldCase.correspondence,
    caseToUpdate.correspondence,
    'correspondenceId',
  );

  const validCorrespondence = Correspondence.validateRawCollection([
    ...addedCorrespondences,
    ...updatedCorrespondences,
    ...addedArchivedCorrespondences,
    ...updatedArchivedCorrespondences,
  ]);

  if (isEmpty(validCorrespondence)) {
    return [];
  }

  await upsertCaseCorrespondences(validCorrespondence);
};

/**
 * Identifies hearings to be removed, and issues persistence calls
 * where needed
 * @param {object} args the arguments for updating the case
 * @param {object} args.applicationContext the application context
 * @param {object} args.caseToUpdate the case with its updated hearings data
 * @param {object} args.oldCase the case as it is currently stored in persistence, prior to these changes
 * @returns {Array<function>} the persistence functions required to complete this action
 */
const updateHearings = async ({
  applicationContext,
  caseToUpdate,
  oldCase,
}: {
  applicationContext: ServerApplicationContext;
  caseToUpdate: RawCase;
  oldCase: RawCase;
}) => {
  const { removed: deletedHearings } = diff(
    oldCase.hearings,
    caseToUpdate.hearings,
    'trialSessionId',
  );

  await settlePromises(
    deletedHearings.map(({ trialSessionId }) =>
      applicationContext.getPersistenceGateway().removeCaseFromHearing({
        applicationContext,
        docketNumber: caseToUpdate.docketNumber,
        trialSessionId,
      }),
    ),
  );
};

/**
 * Identifies IRS practitioners to be updated or removed, and issues persistence calls
 * where needed
 * @param {object} args the arguments for updating the case
 * @param {object} args.applicationContext the application context
 * @param {object} args.caseToUpdate the case with its updated IRS practitioner data
 * @param {object} args.oldCase the case as it is currently stored in persistence, prior to these changes
 * @returns {Array<function>} the persistence functions required to complete this action
 */
const updateIrsPractitioners = async ({
  applicationContext,
  caseToUpdate,
  oldCase,
}: {
  applicationContext: ServerApplicationContext;
  caseToUpdate: RawCase;
  oldCase: RawCase;
}) => {
  const {
    added: addedIrsPractitioners,
    removed: deletedIrsPractitioners,
    same: unchangedIrsPractitioners,
    updated: updatedIrsPractitioners,
  } = diff(oldCase.irsPractitioners, caseToUpdate.irsPractitioners, 'userId');

  const currentIrsPractitioners = [
    ...addedIrsPractitioners,
    ...updatedIrsPractitioners,
  ];

  if (caseToUpdate.leadDocketNumber && unchangedIrsPractitioners.length) {
    currentIrsPractitioners.push(...unchangedIrsPractitioners);
  }

  const validIrsPractitioners = IrsPractitioner.validateRawCollection(
    currentIrsPractitioners,
  );

  const deletePractitionerPromises = deletedIrsPractitioners.map(practitioner =>
    applicationContext.getPersistenceGateway().removeIrsPractitionerOnCase({
      applicationContext,
      docketNumber: caseToUpdate.docketNumber,
      userId: practitioner.userId,
    }),
  );

  const updatePractitionerPromises = validIrsPractitioners.map(practitioner =>
    applicationContext.getPersistenceGateway().updateIrsPractitionerOnCase({
      applicationContext,
      docketNumber: caseToUpdate.docketNumber,
      leadDocketNumber: caseToUpdate.leadDocketNumber,
      practitioner,
      userId: practitioner.userId,
    }),
  );

  await settlePromises([
    ...deletePractitionerPromises,
    ...updatePractitionerPromises,
  ]);
};

/**
 * Identifies private practitioners to be updated or removed, and issues persistence calls
 * where needed
 * @param {object} args the arguments for updating the case
 * @param {object} args.applicationContext the application context
 * @param {object} args.caseToUpdate the case with its updated private practitioner data
 * @param {object} args.oldCase the case as it is currently stored in persistence, prior to these changes
 * @returns {Array<function>} the persistence functions required to complete this action
 */
const updatePrivatePractitioners = async ({
  applicationContext,
  caseToUpdate,
  oldCase,
}: {
  applicationContext: ServerApplicationContext;
  caseToUpdate: RawCase;
  oldCase: RawCase;
}) => {
  const {
    added: addedPrivatePractitioners,
    removed: deletedPrivatePractitioners,
    same: unchangedPrivatePractitioners,
    updated: updatedPrivatePractitioners,
  } = diff(
    oldCase.privatePractitioners,
    caseToUpdate.privatePractitioners,
    'userId',
  );

  const currentPrivatePractitioners = [
    ...addedPrivatePractitioners,
    ...updatedPrivatePractitioners,
  ];

  if (caseToUpdate.leadDocketNumber && unchangedPrivatePractitioners.length) {
    currentPrivatePractitioners.push(...unchangedPrivatePractitioners);
  }

  const validPrivatePractitioners = PrivatePractitioner.validateRawCollection(
    currentPrivatePractitioners,
  );

  const deletePractitionerPromises = deletedPrivatePractitioners.map(
    practitioner =>
      applicationContext
        .getPersistenceGateway()
        .removePrivatePractitionerOnCase({
          applicationContext,
          docketNumber: caseToUpdate.docketNumber,
          userId: practitioner.userId,
        }),
  );

  const updatePractitionerPromises = validPrivatePractitioners.map(
    practitioner =>
      applicationContext
        .getPersistenceGateway()
        .updatePrivatePractitionerOnCase({
          applicationContext,
          docketNumber: caseToUpdate.docketNumber,
          leadDocketNumber: caseToUpdate.leadDocketNumber,
          // @ts-ignore
          practitioner,
          userId: practitioner.userId,
        }),
  );

  await settlePromises([
    ...deletePractitionerPromises,
    ...updatePractitionerPromises,
  ]);
};

/**
 * Identifies work item entries which have been updated and issues persistence calls
 * @param {object} args the arguments for updating the case
 * @param {object} args.applicationContext the application context
 * @param {object} args.caseToUpdate the case with its updated document data
 * @param {object} args.oldCase the case as it is currently stored in persistence, prior to these changes
 * @returns {Array<function>} the persistence functions required to complete this action
 */
const updateCaseWorkItems = async ({
  caseToUpdate,
  oldCase,
}: {
  caseToUpdate: RawCase;
  oldCase: RawCase;
}) => {
  const workItemsRequireUpdate =
    oldCase.associatedJudge !== caseToUpdate.associatedJudge;

  if (!workItemsRequireUpdate) {
    return [];
  }

  const workItems = await getWorkItemsByDocketNumber({
    docketNumber: caseToUpdate.docketNumber,
  });

  if (!workItems) {
    return [];
  }

  const updatedWorkItems = workItems.map(rawWorkItem => ({
    ...rawWorkItem,
    associatedJudge: caseToUpdate.associatedJudge,
    associatedJudgeId: caseToUpdate.associatedJudgeId,
  }));

  const validWorkItems = WorkItem.validateRawCollection(updatedWorkItems);
  await upsertWorkItems({ workItems: validWorkItems });
};

const updateCaseDeadlines = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applicationContext, // cannot remove till remaining RELATED_CASE_OPERATIONS functions no longer use applicationContext
  caseToUpdate,
  oldCase,
}: {
  applicationContext: ServerApplicationContext;
  caseToUpdate: RawCase;
  oldCase: RawCase;
}) => {
  if (oldCase.associatedJudge === caseToUpdate.associatedJudge) {
    return [];
  }
  const deadlines = await getCaseDeadlinesByDocketNumber({
    docketNumber: caseToUpdate.docketNumber,
  });

  deadlines.forEach(caseDeadline => {
    // @ts-ignore
    caseDeadline.associatedJudge = caseToUpdate.associatedJudge;
    // @ts-ignore
    caseDeadline.associatedJudgeId = caseToUpdate.associatedJudgeId;
  });
  const validCaseDeadlines = CaseDeadline.validateRawCollection(deadlines);
  await upsertCaseDeadlines(validCaseDeadlines);
};

/**
 * updateCaseAndAssociations
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseToUpdate the case object which was updated
 * @returns {Promise<*>} the updated case entity
 */
export const updateCaseAndAssociations = async ({
  applicationContext,
  authorizedUser,
  caseToUpdate,
  includeCorrespondenceAndWorkItems = true,
}: {
  applicationContext: ServerApplicationContext;
  authorizedUser: UnknownAuthUser;
  caseToUpdate: any;
  includeCorrespondenceAndWorkItems?: boolean;
}): Promise<RawCase> => {
  const newCaseEntity: Case = caseToUpdate.validate
    ? caseToUpdate
    : new Case(caseToUpdate, {
        authorizedUser,
      });

  const oldCaseEntity = await getCaseByDocketNumber({
    applicationContext,
    docketNumber: caseToUpdate.docketNumber,
  });

  const validNewRawCaseEntity = newCaseEntity.validate().toRawObject();

  const validRawOldCaseEntity = new Case(oldCaseEntity, {
    authorizedUser,
  })
    .validate()
    .toRawObject();

  const RELATED_CASE_OPERATIONS = [
    updateCaseDeadlines,
    updateCaseDocketEntries,
    updateCaseMessages,
    updateHearings,
    updateIrsPractitioners,
    updatePrivatePractitioners,
  ];

  if (includeCorrespondenceAndWorkItems) {
    RELATED_CASE_OPERATIONS.push(updateCaseWorkItems, updateCorrespondence);
  }

  // const validationRequests = RELATED_CASE_OPERATIONS.map(fn =>
  // fn({
  //   applicationContext,
  //   authorizedUser,
  //   caseToUpdate: validNewRawCaseEntity,
  //   oldCase: validRawOldCaseEntity,
  // }),
  // );

  // wait for all validation tasks to complete and for callbacks to be generated
  // const persistenceCallbacks = (await Promise.all(validationRequests)).flat();

  // Persist primary case data first to ensure no errors
  await upsertCases([validNewRawCaseEntity]);

  await settlePromises(
    RELATED_CASE_OPERATIONS.map(fn =>
      fn({
        applicationContext,
        authorizedUser,
        caseToUpdate: validNewRawCaseEntity,
        oldCase: validRawOldCaseEntity,
      }),
    ),
  );
  // Then persist related data
  // all validation has passed, so now execute all persistence callbacks from results
  // const persistenceRequests = persistenceCallbacks.map(persistFn => {
  //   persistFn();
  // });

  return validNewRawCaseEntity;
};
