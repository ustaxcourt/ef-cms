const diff = require('diff-arrays-of-objects');
const { Case } = require('../../entities/cases/Case');
const { Correspondence } = require('../../entities/Correspondence');
const { DocketEntry } = require('../../entities/DocketEntry');
const { IrsPractitioner } = require('../../entities/IrsPractitioner');
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
    { applicationContext },
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
    updateCorrespondence,
    updateHearings,
    updateIrsPractitioners,
    updatePrivatePractitioners,
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
