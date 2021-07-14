const diff = require('diff-arrays-of-objects');
const { Case } = require('../../entities/cases/Case');
const { CaseDeadline } = require('../../entities/CaseDeadline');
const { Correspondence } = require('../../entities/Correspondence');
const { DocketEntry } = require('../../entities/DocketEntry');
const { IrsPractitioner } = require('../../entities/IrsPractitioner');
const { Message } = require('../../entities/Message');
const { pick } = require('lodash');
const { PrivatePractitioner } = require('../../entities/PrivatePractitioner');

/**
 * Identifies docket entries which have been updated and issues persistence calls
 *
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
 *
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
  const messageUpdatesNecessary =
    oldCase.status !== caseToUpdate.status ||
    oldCase.caseCaption !== caseToUpdate.caseCaption ||
    oldCase.docketNumberSuffix !== caseToUpdate.docketNumberSuffix;

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

  caseMessages.forEach(message => {
    message.caseStatus = caseToUpdate.status;
    message.caseTitle = Case.getCaseTitle(caseToUpdate.caseCaption);
    message.docketNumberSuffix = caseToUpdate.docketNumberSuffix;
  });

  const validMessages = Message.validateRawCollection(caseMessages, {
    applicationContext,
  });

  return validMessages.map(
    message =>
      function updateCaseMessages_cb() {
        return applicationContext.getPersistenceGateway().updateMessage({
          applicationContext,
          message,
        });
      },
  );
};

/**
 * Identifies correspondences which have been updated and issues persistence calls
 *
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
 *
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
 *
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
    updated: updatedIrsPractitioners,
  } = diff(oldCase.irsPractitioners, caseToUpdate.irsPractitioners, 'userId');

  const validIrsPractitioners = IrsPractitioner.validateRawCollection(
    [...addedIrsPractitioners, ...updatedIrsPractitioners],
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
 *
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
    updated: updatedPrivatePractitioners,
  } = diff(
    oldCase.privatePractitioners,
    caseToUpdate.privatePractitioners,
    'userId',
  );

  const validPrivatePractitioners = PrivatePractitioner.validateRawCollection(
    [...addedPrivatePractitioners, ...updatedPrivatePractitioners],
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
            practitioner,
            userId: practitioner.userId,
          });
      },
  );

  return [...deletePractitionerFunctions, ...updatePractitionerFunctions];
};

/**
 * Identifies work item entries which have been updated and issues persistence calls
 *
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
    oldCase.trialDate !== caseToUpdate.trialDate;

  if (!workItemsRequireUpdate) {
    return [];
  }

  const workItemMappings = await applicationContext
    .getPersistenceGateway()
    .getWorkItemMappingsByDocketNumber({
      applicationContext,
      docketNumber: caseToUpdate.docketNumber,
    });

  const updateWorkItemRecordFunctions = (
    updatedCase,
    previousCase,
    workItemId,
  ) => {
    const workItemRequestFunctions = [];
    if (previousCase.associatedJudge !== updatedCase.associatedJudge) {
      workItemRequestFunctions.push(() =>
        applicationContext
          .getUseCaseHelpers()
          .updateAssociatedJudgeOnWorkItems({
            applicationContext,
            associatedJudge: updatedCase.associatedJudge,
            workItemId,
          }),
      );
    }
    if (previousCase.caseCaption !== updatedCase.caseCaption) {
      workItemRequestFunctions.push(() =>
        applicationContext.getUseCaseHelpers().updateCaseTitleOnWorkItems({
          applicationContext,
          caseTitle: Case.getCaseTitle(updatedCase.caseCaption),
          workItemId,
        }),
      );
    }
    if (previousCase.docketNumberSuffix !== updatedCase.docketNumberSuffix) {
      workItemRequestFunctions.push(() =>
        applicationContext
          .getUseCaseHelpers()
          .updateDocketNumberSuffixOnWorkItems({
            applicationContext,
            docketNumberSuffix: updatedCase.docketNumberSuffix,
            workItemId,
          }),
      );
    }
    if (previousCase.status !== updatedCase.status) {
      workItemRequestFunctions.push(() =>
        applicationContext.getUseCaseHelpers().updateCaseStatusOnWorkItems({
          applicationContext,
          caseStatus: updatedCase.status,
          workItemId,
        }),
      );
    }
    if (previousCase.trialDate !== updatedCase.trialDate) {
      workItemRequestFunctions.push(() =>
        applicationContext.getUseCaseHelpers().updateTrialDateOnWorkItems({
          applicationContext,
          trialDate: updatedCase.trialDate || null,
          workItemId,
        }),
      );
    }

    return workItemRequestFunctions;
  };

  const workItemIds = workItemMappings.map(mapping => mapping.sk.split('|')[1]);
  const workItemUpdateFunctions = workItemIds
    .map(workItemId =>
      updateWorkItemRecordFunctions(caseToUpdate, oldCase, workItemId),
    )
    .flat();

  return workItemUpdateFunctions;
};

/**
 * Identifies user case mappings which require updates and issues persistence calls
 *
 * @param {object} args the arguments for updating the case
 * @param {object} args.applicationContext the application context
 * @param {object} args.caseToUpdate the case with its updated document data
 * @param {object} args.oldCase the case as it is currently stored in persistence, prior to these changes
 * @returns {Array<function>} the persistence functions required to complete this action
 */
const updateUserCaseMappings = async ({
  applicationContext,
  caseToUpdate,
  oldCase,
}) => {
  const userCaseMappingsRequireUpdate =
    oldCase.status !== caseToUpdate.status ||
    oldCase.docketNumberSuffix !== caseToUpdate.docketNumberSuffix ||
    oldCase.caseCaption !== caseToUpdate.caseCaption ||
    oldCase.leadDocketNumber !== caseToUpdate.leadDocketNumber;

  if (!userCaseMappingsRequireUpdate) {
    return [];
  }

  const userCaseMappings = await applicationContext
    .getPersistenceGateway()
    .getUserCaseMappingsByDocketNumber({
      applicationContext,
      docketNumber: caseToUpdate.docketNumber,
    });

  const updatedAttributeValues = pick(caseToUpdate, [
    'caseCaption',
    'closedDate',
    'docketNumberSuffix',
    'docketNumberWithSuffix',
    'leadDocketNumber',
    'status',
  ]);

  return userCaseMappings.map(
    ucItem =>
      function updateUserCaseMappings_cb() {
        applicationContext.getPersistenceGateway().updateUserCaseMapping({
          applicationContext,
          userCaseItem: { ...ucItem, ...updatedAttributeValues },
        });
      },
  );
};

/**
 * Identifies user case mappings which require updates and issues persistence calls
 *
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

  deadlines.forEach(
    caseDeadline =>
      (caseDeadline.associatedJudge = caseToUpdate.associatedJudge),
  );
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
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseToUpdate the case object which was updated
 * @returns {Promise<*>} the updated case entity
 */
exports.updateCaseAndAssociations = async ({
  applicationContext,
  caseToUpdate,
}) => {
  const caseEntity = caseToUpdate.validate
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
    updateUserCaseMappings,
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
