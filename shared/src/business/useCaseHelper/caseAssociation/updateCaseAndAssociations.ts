import { Case } from '../../entities/cases/Case';
import { CaseDeadline } from '../../entities/CaseDeadline';
import { Correspondence } from '../../entities/Correspondence';
import { DocketEntry } from '../../entities/DocketEntry';
import { IrsPractitioner } from '../../entities/IrsPractitioner';
import { Message } from '../../entities/Message';
import { PrivatePractitioner } from '../../entities/PrivatePractitioner';
import { WorkItem } from '../../entities/WorkItem';
import diff from 'diff-arrays-of-objects';

/**
 * Identifies docket entries which have been updated and issues persistence calls
 * @param {object} args the arguments for updating the case
 * @param {object} args.applicationContext the application context
 * @param {object} args.caseToUpdate the case with its updated document data
 * @param {object} args.oldCase the case as it is currently stored in persistence, prior to these changes
 * @returns {Array<function>} the persistence functions required to complete this action
 */
const updateCaseDocketEntries = ({
  applicationContext,
  caseToUpdate,
  oldCase,
}) => {
  const { added: addedDocketEntries, updated: updatedDocketEntries } = diff(
    oldCase.docketEntries,
    caseToUpdate.docketEntries,
    'docketEntryId',
  );

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
    { applicationContext, petitioners: caseToUpdate.petitioners },
  );

  return validDocketEntries.map(
    doc =>
      function updateCaseDocketEntries_cb() {
        return applicationContext.getPersistenceGateway().updateDocketEntry({
          applicationContext,
          docketEntryId: doc.docketEntryId,
          docketNumber: caseToUpdate.docketNumber,
          document: doc,
        });
      },
  );
};

/**
 * Identifies case messages which have been updated and issues persistence calls
 * @param {object} args the arguments for updating the case
 * @param {object} args.applicationContext the application context
 * @param {object} args.caseToUpdate the case with its updated document data
 * @param {object} args.oldCase the case as it is currently stored in persistence, prior to these changes
 * @returns {Array<function>} the persistence functions required to complete this action
 */
const updateCaseMessages = async ({
  applicationContext,
  caseToUpdate,
  oldCase,
}) => {
  const messageUpdatesNecessary = Message.CASE_PROPERTIES.filter(
    caseProperty => oldCase[caseProperty] !== caseToUpdate[caseProperty],
  ).length;

  if (!messageUpdatesNecessary) {
    return [];
  }

  const caseMessages = await applicationContext
    .getPersistenceGateway()
    .getMessagesByDocketNumber({
      applicationContext,
      docketNumber: caseToUpdate.docketNumber,
    });

  if (!caseMessages) {
    return [];
  }

  const caseEntities = caseMessages.map(
    message =>
      new Message(message, { applicationContext, caseEntity: caseToUpdate }),
  );

  const validMessages = Message.validateRawCollection(caseEntities, {
    applicationContext,
  });

  return validMessages.map(
    message =>
      function updateCaseMessages_cb() {
        return applicationContext.getPersistenceGateway().upsertMessage({
          applicationContext,
          message,
        });
      },
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
const updateCorrespondence = ({
  applicationContext,
  caseToUpdate,
  oldCase,
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

  const validCorrespondence = Correspondence.validateRawCollection(
    [
      ...addedCorrespondences,
      ...updatedCorrespondences,
      ...addedArchivedCorrespondences,
      ...updatedArchivedCorrespondences,
    ],
    { applicationContext },
  );

  return validCorrespondence.map(
    correspondence =>
      function updateCorrespondence_cb() {
        return applicationContext
          .getPersistenceGateway()
          .updateCaseCorrespondence({
            applicationContext,
            correspondence,
            docketNumber: caseToUpdate.docketNumber,
          });
      },
  );
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
const updateHearings = ({ applicationContext, caseToUpdate, oldCase }) => {
  const { removed: deletedHearings } = diff(
    oldCase.hearings,
    caseToUpdate.hearings,
    'trialSessionId',
  );

  return deletedHearings.map(
    ({ trialSessionId }) =>
      function updateHearings_cb() {
        return applicationContext
          .getPersistenceGateway()
          .removeCaseFromHearing({
            applicationContext,
            docketNumber: caseToUpdate.docketNumber,
            trialSessionId,
          });
      },
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
const updateIrsPractitioners = ({
  applicationContext,
  caseToUpdate,
  oldCase,
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
    { applicationContext },
  );

  const deletePractitionerFunctions = deletedIrsPractitioners.map(
    practitioner =>
      function deleteIrsPractitioner_cb() {
        return applicationContext
          .getPersistenceGateway()
          .removeIrsPractitionerOnCase({
            applicationContext,
            docketNumber: caseToUpdate.docketNumber,
            userId: practitioner.userId,
          });
      },
  );

  const updatePractitionerFunctions = validIrsPractitioners.map(
    practitioner =>
      function updateIrsPractitioners_cb() {
        return applicationContext
          .getPersistenceGateway()
          .updateIrsPractitionerOnCase({
            applicationContext,
            docketNumber: caseToUpdate.docketNumber,
            leadDocketNumber: caseToUpdate.leadDocketNumber,
            practitioner,
            userId: practitioner.userId,
          });
      },
  );

  return [...deletePractitionerFunctions, ...updatePractitionerFunctions];
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
const updatePrivatePractitioners = ({
  applicationContext,
  caseToUpdate,
  oldCase,
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
    { applicationContext },
  );

  const deletePractitionerFunctions = deletedPrivatePractitioners.map(
    practitioner =>
      function deletePrivatePractitioner_cb() {
        return applicationContext
          .getPersistenceGateway()
          .removePrivatePractitionerOnCase({
            applicationContext,
            docketNumber: caseToUpdate.docketNumber,
            userId: practitioner.userId,
          });
      },
  );

  const updatePractitionerFunctions = validPrivatePractitioners.map(
    practitioner =>
      function updatePrivatePractitioner_cb() {
        return applicationContext
          .getPersistenceGateway()
          .updatePrivatePractitionerOnCase({
            applicationContext,
            docketNumber: caseToUpdate.docketNumber,
            leadDocketNumber: caseToUpdate.leadDocketNumber,
            practitioner,
            userId: practitioner.userId,
          });
      },
  );

  return [...deletePractitionerFunctions, ...updatePractitionerFunctions];
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
  applicationContext,
  caseToUpdate,
  oldCase,
}) => {
  const workItemsRequireUpdate =
    oldCase.associatedJudge !== caseToUpdate.associatedJudge ||
    oldCase.docketNumberSuffix !== caseToUpdate.docketNumberSuffix ||
    oldCase.caseCaption !== caseToUpdate.caseCaption ||
    oldCase.status !== caseToUpdate.status ||
    oldCase.trialDate !== caseToUpdate.trialDate ||
    oldCase.trialLocation !== caseToUpdate.trialLocation ||
    oldCase.leadDocketNumber !== caseToUpdate.leadDocketNumber;

  if (!workItemsRequireUpdate) {
    return [];
  }

  const rawWorkItems = await applicationContext
    .getPersistenceGateway()
    .getWorkItemsByDocketNumber({
      applicationContext,
      docketNumber: caseToUpdate.docketNumber,
    });

  const updatedWorkItems = rawWorkItems.map(rawWorkItem => ({
    ...rawWorkItem,
    associatedJudge: caseToUpdate.associatedJudge,
    associatedJudgeId: caseToUpdate.associatedJudgeId,
    caseStatus: caseToUpdate.status,
    caseTitle: Case.getCaseTitle(caseToUpdate.caseCaption),
    docketNumberWithSuffix: caseToUpdate.docketNumberWithSuffix,
    leadDocketNumber: caseToUpdate.leadDocketNumber,
    trialDate: caseToUpdate.trialDate || null,
    trialLocation: caseToUpdate.trialLocation || null,
  }));

  const validWorkItems = WorkItem.validateRawCollection(updatedWorkItems, {
    applicationContext,
  });

  return validWorkItems.map(
    validWorkItem =>
      function () {
        return applicationContext.getPersistenceGateway().saveWorkItem({
          applicationContext,
          workItem: validWorkItem,
        });
      },
  );
};

/**
 * Identifies user case mappings which require updates and issues persistence calls
 * @param {object} args the arguments for updating the case
 * @param {object} args.applicationContext the application context
 * @param {object} args.caseToUpdate the case with its updated document data
 * @param {object} args.oldCase the case as it is currently stored in persistence, prior to these changes
 * @returns {Array<function>} the persistence functions required to complete this action
 */
const updateCaseDeadlines = async ({
  applicationContext,
  caseToUpdate,
  oldCase,
}) => {
  if (oldCase.associatedJudge === caseToUpdate.associatedJudge) {
    return [];
  }

  const deadlines = await applicationContext
    .getPersistenceGateway()
    .getCaseDeadlinesByDocketNumber({
      applicationContext,
      docketNumber: caseToUpdate.docketNumber,
    });

  deadlines.forEach(caseDeadline => {
    caseDeadline.associatedJudge = caseToUpdate.associatedJudge;
    caseDeadline.associatedJudgeId = caseToUpdate.associatedJudgeId;
  });
  const validCaseDeadlines = CaseDeadline.validateRawCollection(deadlines, {
    applicationContext,
  });

  return validCaseDeadlines.map(
    caseDeadline =>
      function updateCaseDeadlines_cb() {
        return applicationContext.getPersistenceGateway().createCaseDeadline({
          applicationContext,
          caseDeadline,
        });
      },
  );
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
  caseToUpdate,
}: {
  applicationContext: IApplicationContext;
  caseToUpdate: any;
}): Promise<RawCase> => {
  const caseEntity: Case = caseToUpdate.validate
    ? caseToUpdate
    : new Case(caseToUpdate, { applicationContext });

  const oldCaseEntity = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: caseToUpdate.docketNumber,
    });

  const validRawCaseEntity = caseEntity.validate().toRawObject();

  const validRawOldCaseEntity = new Case(oldCaseEntity, { applicationContext })
    .validate()
    .toRawObject();

  const RELATED_CASE_OPERATIONS = [
    updateCaseDeadlines,
    updateCaseDocketEntries,
    updateCaseMessages,
    updateCaseWorkItems,
    updateCorrespondence,
    updateHearings,
    updateIrsPractitioners,
    updatePrivatePractitioners,
  ];

  const validationRequests = RELATED_CASE_OPERATIONS.map(fn =>
    fn({
      applicationContext,
      caseToUpdate: validRawCaseEntity,
      oldCase: validRawOldCaseEntity,
    }),
  );

  // wait for all validation tasks to complete and for callbacks to be generated
  const persistenceCallbacks = (await Promise.all(validationRequests)).flat();

  // all validation has passed, so now execute all persistence callbacks from results
  const persistenceRequests = persistenceCallbacks.map(persistFn => {
    persistFn();
  });

  await Promise.all(persistenceRequests);

  return applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: validRawCaseEntity,
  });
};
