import { Case } from '@shared/business/entities/cases/Case';
import { CaseDeadline } from '@shared/business/entities/CaseDeadline';
import { Correspondence } from '@shared/business/entities/Correspondence';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { Message } from '@shared/business/entities/Message';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getMessagesByDocketNumber } from '@web-api/persistence/postgres/messages/getMessagesByDocketNumber';
import { updateMessage } from '@web-api/persistence/postgres/messages/updateMessage';
import { getCaseDeadlinesByDocketNumber } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { isEmpty } from 'lodash';
import { upsertCaseCorrespondences } from '@web-api/persistence/postgres/caseCorrespondences/upsertCaseCorrespondences';
import { upsertCaseDeadlines } from '@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadlines';
import diff from 'diff-arrays-of-objects';
import { upsertDocketEntries } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';
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
const updateCaseDocketEntries = ({
  authorizedUser,
  caseToUpdate,
  oldCase,
}: {
  authorizedUser: UnknownAuthUser;
  caseToUpdate: any;
  oldCase: any;
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
    { authorizedUser, petitioners: caseToUpdate.petitioners },
  );

  return [() => upsertDocketEntries(validDocketEntries)];
};

const updateCaseMessages = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applicationContext, // cannot remove till remaining RELATED_CASE_OPERATIONS functions no longer use applicationContext
  caseToUpdate,
  oldCase,
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
    message.docketNumberSuffix = caseToUpdate.docketNumberSuffix;
  });

  const validMessages = Message.validateRawCollection(caseMessages);

  return validMessages.map(
    message =>
      async function updateCaseMessages_cb() {
        return await updateMessage({
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const validCorrespondence = Correspondence.validateRawCollection([
    ...addedCorrespondences,
    ...updatedCorrespondences,
    ...addedArchivedCorrespondences,
    ...updatedArchivedCorrespondences,
  ]);

  if (isEmpty(validCorrespondence)) {
    return [];
  }

  return [() => upsertCaseCorrespondences(validCorrespondence)];
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

const updateCaseDeadlines = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applicationContext, // cannot remove till remaining RELATED_CASE_OPERATIONS functions no longer use applicationContext
  caseToUpdate,
  oldCase,
}) => {
  if (oldCase.associatedJudge === caseToUpdate.associatedJudge) {
    return [];
  }
  const deadlines = await getCaseDeadlinesByDocketNumber({
    docketNumber: caseToUpdate.docketNumber,
  });

  deadlines.forEach(caseDeadline => {
    caseDeadline.associatedJudge = caseToUpdate.associatedJudge;
    caseDeadline.associatedJudgeId = caseToUpdate.associatedJudgeId;
  });
  const validCaseDeadlines = CaseDeadline.validateRawCollection(deadlines);

  return [() => upsertCaseDeadlines(validCaseDeadlines)];
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
  includeCorrespondence = true,
}: {
  applicationContext: ServerApplicationContext;
  authorizedUser: UnknownAuthUser;
  caseToUpdate: any;
  includeCorrespondence?: boolean;
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

  if (includeCorrespondence) {
    RELATED_CASE_OPERATIONS.push(updateCorrespondence);
  }

  const validationRequests = RELATED_CASE_OPERATIONS.map(fn =>
    fn({
      applicationContext,
      authorizedUser,
      caseToUpdate: validNewRawCaseEntity,
      oldCase: validRawOldCaseEntity,
    }),
  );

  // wait for all validation tasks to complete and for callbacks to be generated
  const persistenceCallbacks = (await Promise.all(validationRequests)).flat();

  
  // Persist primary case data first to ensure no errors
  await upsertCases([validNewRawCaseEntity]);
  
  // Then persist related data
  // all validation has passed, so now execute all persistence callbacks from results
  const persistenceRequests = persistenceCallbacks.map(persistFn => {
    return persistFn();
  });
  await settlePromises(persistenceRequests);

  return validNewRawCaseEntity;
};
