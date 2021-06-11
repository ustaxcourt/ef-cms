const diff = require('diff-arrays-of-objects');
const { Case } = require('../../entities/cases/Case');
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
 * @returns {Array<Promise>} the persistence request promises
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

  return validDocketEntries.map(doc =>
    applicationContext.getPersistenceGateway().updateDocketEntry({
      applicationContext,
      docketEntryId: doc.docketEntryId,
      docketNumber: caseToUpdate.docketNumber,
      document: doc,
    }),
  );
};

/**
 * Identifies case messages which have been updated and issues persistence calls
 *
 * @param {object} args the arguments for updating the case
 * @param {object} args.applicationContext the application context
 * @param {object} args.caseToUpdate the case with its updated document data
 * @param {object} args.oldCase the case as it is currently stored in persistence, prior to these changes
 * @returns {Array<Promise>} the persistence request promises
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

  return validMessages.map(message =>
    applicationContext.getPersistenceGateway().updateMessage({
      applicationContext,
      message,
    }),
  );
};

/**
 * Identifies correspondences which have been updated and issues persistence calls
 *
 * @param {object} args the arguments for updating the case
 * @param {object} args.applicationContext the application context
 * @param {object} args.caseToUpdate the case with its updated correspondence data
 * @param {object} args.oldCase the case as it is currently stored in persistence, prior to these changes
 * @returns {Array<Promise>} the persistence request promises
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

  return validCorrespondence.map(correspondence =>
    applicationContext.getPersistenceGateway().updateCaseCorrespondence({
      applicationContext,
      correspondence,
      docketNumber: caseToUpdate.docketNumber,
    }),
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
 * @returns {Array<Promise>} the persistence request promises
 */
const updateHearings = ({ applicationContext, caseToUpdate, oldCase }) => {
  const { removed: deletedHearings } = diff(
    oldCase.hearings,
    caseToUpdate.hearings,
    'trialSessionId',
  );

  return deletedHearings.map(({ trialSessionId }) =>
    applicationContext.getPersistenceGateway().removeCaseFromHearing({
      applicationContext,
      docketNumber: caseToUpdate.docketNumber,
      trialSessionId,
    }),
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
 * @returns {Array<Promise>} the persistence request promises
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

  const deletePractitionerRequests = deletedIrsPractitioners.map(practitioner =>
    applicationContext.getPersistenceGateway().removeIrsPractitionerOnCase({
      applicationContext,
      docketNumber: caseToUpdate.docketNumber,
      userId: practitioner.userId,
    }),
  );

  const validIrsPractitioners = IrsPractitioner.validateRawCollection(
    [...addedIrsPractitioners, ...updatedIrsPractitioners],
    { applicationContext },
  );

  const updatePractitionerRequests = validIrsPractitioners.map(practitioner =>
    applicationContext.getPersistenceGateway().updateIrsPractitionerOnCase({
      applicationContext,
      docketNumber: caseToUpdate.docketNumber,
      practitioner,
      userId: practitioner.userId,
    }),
  );

  return [...deletePractitionerRequests, ...updatePractitionerRequests];
};

/**
 * Identifies private practitioners to be updated or removed, and issues persistence calls
 * where needed
 *
 * @param {object} args the arguments for updating the case
 * @param {object} args.applicationContext the application context
 * @param {object} args.caseToUpdate the case with its updated private practitioner data
 * @param {object} args.oldCase the case as it is currently stored in persistence, prior to these changes
 * @returns {Array<Promise>} the persistence request promises
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

  const deletePractitionerRequests = deletedPrivatePractitioners.map(
    practitioner =>
      applicationContext
        .getPersistenceGateway()
        .removePrivatePractitionerOnCase({
          applicationContext,
          docketNumber: caseToUpdate.docketNumber,
          userId: practitioner.userId,
        }),
  );

  const validPrivatePractitioners = PrivatePractitioner.validateRawCollection(
    [...addedPrivatePractitioners, ...updatedPrivatePractitioners],
    { applicationContext },
  );

  const updatePractitionerRequests = validPrivatePractitioners.map(
    practitioner =>
      applicationContext
        .getPersistenceGateway()
        .updatePrivatePractitionerOnCase({
          applicationContext,
          docketNumber: caseToUpdate.docketNumber,
          practitioner,
          userId: practitioner.userId,
        }),
  );

  return [...deletePractitionerRequests, ...updatePractitionerRequests];
};

/**
 * Identifies work item entries which have been updated and issues persistence calls
 *
 * @param {object} args the arguments for updating the case
 * @param {object} args.applicationContext the application context
 * @param {object} args.caseToUpdate the case with its updated document data
 * @param {object} args.oldCase the case as it is currently stored in persistence, prior to these changes
 * @returns {Array<Promise>} the persistence request promises
 */
const updateCaseWorkItems = async ({
  applicationContext,
  caseToUpdate,
  oldCase,
}) => {
  const workItemUpdates = [];

  const workItemsRequireUpdate =
    oldCase.associatedJudge !== caseToUpdate.associatedJudge ||
    oldCase.docketNumberSuffix !== caseToUpdate.docketNumberSuffix ||
    oldCase.caseCaption !== caseToUpdate.caseCaption ||
    oldCase.status !== caseToUpdate.status ||
    oldCase.trialDate !== caseToUpdate.trialDate;

  if (!workItemsRequireUpdate) {
    return workItemUpdates;
  }

  const workItemMappings = await applicationContext
    .getPersistenceGateway()
    .getWorkItemMappingsByDocketNumber({
      applicationContext,
      docketNumber: caseToUpdate.docketNumber,
    });

  const updateWorkItemRecords = (updatedCase, previousCase, workItemId) => {
    const workItemRequests = [];
    if (previousCase.associatedJudge !== updatedCase.associatedJudge) {
      workItemRequests.push(
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
      workItemRequests.push(
        applicationContext.getUseCaseHelpers().updateCaseTitleOnWorkItems({
          applicationContext,
          caseTitle: Case.getCaseTitle(updatedCase.caseCaption),
          workItemId,
        }),
      );
    }
    if (previousCase.docketNumberSuffix !== updatedCase.docketNumberSuffix) {
      workItemRequests.push(
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
      workItemRequests.push(
        applicationContext.getUseCaseHelpers().updateCaseStatusOnWorkItems({
          applicationContext,
          caseStatus: updatedCase.status,
          workItemId,
        }),
      );
    }
    if (previousCase.trialDate !== updatedCase.trialDate) {
      workItemRequests.push(
        applicationContext.getUseCaseHelpers().updateTrialDateOnWorkItems({
          applicationContext,
          trialDate: updatedCase.trialDate || null,
          workItemId,
        }),
      );
    }

    return workItemRequests;
  };

  for (let mapping of workItemMappings) {
    const [, workItemId] = mapping.sk.split('|');
    workItemUpdates.push(
      ...updateWorkItemRecords(caseToUpdate, oldCase, workItemId),
    );
  }

  return workItemUpdates;
};

const updateUserCaseMappings = async ({
  applicationContext,
  caseToUpdate,
  oldCase,
}) => {
  const userCaseMappingUpdates = [];

  const userCaseMappingsRequireUpdate =
    oldCase.status !== caseToUpdate.status ||
    oldCase.docketNumberSuffix !== caseToUpdate.docketNumberSuffix ||
    oldCase.caseCaption !== caseToUpdate.caseCaption ||
    oldCase.leadDocketNumber !== caseToUpdate.leadDocketNumber;

  if (!userCaseMappingsRequireUpdate) {
    return userCaseMappingUpdates;
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

  const mappingUpdateRequests = userCaseMappings.map(ucItem =>
    applicationContext.getPersistenceGateway().updateUserCaseMapping({
      applicationContext,
      userCaseItem: { ...ucItem, ...updatedAttributeValues },
    }),
  );

  return mappingUpdateRequests;
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
    updateCaseDocketEntries,
    updateCaseMessages,
    updateCaseWorkItems,
    updateCorrespondence,
    updateHearings,
    updateIrsPractitioners,
    updatePrivatePractitioners,
    updateUserCaseMappings,
  ];

  const requests = RELATED_CASE_OPERATIONS.map(fn =>
    fn({
      applicationContext,
      caseToUpdate: validRawCaseEntity,
      oldCase: validRawOldCaseEntity,
    }),
  ).flat();

  // TODO: hoist logic from persistence method below to this use case helper.

  await Promise.all(requests);

  return applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: validRawCaseEntity,
    oldCase: validRawOldCaseEntity,
  });
};
