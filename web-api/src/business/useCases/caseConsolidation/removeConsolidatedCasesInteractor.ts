import { Case } from '@shared/business/entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';
import { getCaseDeadlinesByDocketNumber } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { getCaseDeadlinesByConsolidatedCaseDeadlineId } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByConsolidatedCaseDeadlineId';
import {
  CaseDeadline,
  RawCaseDeadline,
} from '@shared/business/entities/CaseDeadline';
import { upsertCaseDeadlines } from '@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadlines';

/**
 * removeConsolidatedCases
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.docketNumber the docket number of the case to consolidate
 * @param {Array} providers.docketNumbersToRemove the docket numbers of the cases to remove from consolidation
 * @returns {object} the updated case data
 */
export const removeConsolidatedCases = async (
  applicationContext: ServerApplicationContext,
  {
    docketNumber,
    docketNumbersToRemove,
  }: { docketNumber: string; docketNumbersToRemove: string[] },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CONSOLIDATE_CASES)) {
    throw new UnauthorizedError('Unauthorized for case consolidation');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  if (!caseToUpdate || !caseToUpdate?.leadDocketNumber) {
    throw new NotFoundError(`Case ${docketNumber} was not found.`);
  }

  const updateCasePromises: Promise<any>[] = [];

  const { leadDocketNumber } = caseToUpdate;

  const allConsolidatedCases = await applicationContext
    .getPersistenceGateway()
    .getCasesByLeadDocketNumber({
      applicationContext,
      leadDocketNumber,
    });

  const newConsolidatedCases: RawCase[] = allConsolidatedCases.filter(
    consolidatedCase =>
      !docketNumbersToRemove.includes(consolidatedCase.docketNumber),
  );

  if (
    docketNumbersToRemove.includes(leadDocketNumber) &&
    newConsolidatedCases.length > 1
  ) {
    const newLeadCase = Case.findLeadCaseForCases(newConsolidatedCases)!;
    for (const newConsolidatedCaseToUpdate of newConsolidatedCases) {
      const caseEntity = new Case(newConsolidatedCaseToUpdate, {
        authorizedUser,
      });
      caseEntity.setLeadCase(newLeadCase.docketNumber);

      updateCasePromises.push(
        applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
          applicationContext,
          authorizedUser,
          caseToUpdate: caseEntity,
        }),
      );
    }

    updateCasePromises.push(
      updateConsolidatedCaseDeadlineReferenceId(
        leadDocketNumber,
        newLeadCase.docketNumber,
      ),
    );
  } else if (newConsolidatedCases.length == 1) {
    // a case cannot be consolidated with itself
    const caseEntity = new Case(newConsolidatedCases[0], {
      authorizedUser,
    });
    caseEntity.removeConsolidation();

    updateCasePromises.push(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
        applicationContext,
        authorizedUser,
        caseToUpdate: caseEntity,
      }),
    );
  }

  for (const docketNumberToRemove of docketNumbersToRemove) {
    const caseToRemove = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber: docketNumberToRemove,
      });

    if (!caseToRemove) {
      throw new NotFoundError(
        `Case to consolidate with (${docketNumberToRemove}) was not found.`,
      );
    }

    const caseEntity = new Case(caseToRemove, { authorizedUser });
    caseEntity.removeConsolidation();

    updateCasePromises.push(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
        applicationContext,
        authorizedUser,
        caseToUpdate: caseEntity,
      }),
    );

    updateCasePromises.push(
      removeConsolidatedCaseReferences(docketNumberToRemove),
    );
  }

  await Promise.all(updateCasePromises);
};

async function removeConsolidatedCaseReferences(docketNumber: string) {
  const CASE_DEADLINES = await getCaseDeadlinesByDocketNumber({
    docketNumber,
  });

  const UPDATED_CASE_DEADLINES = CASE_DEADLINES.map(
    (cd: CaseDeadline) =>
      ({
        ...cd,
        consolidatedCaseDeadlineId: undefined,
      }) as CaseDeadline,
  );

  await upsertCaseDeadlines(UPDATED_CASE_DEADLINES);
}

async function updateConsolidatedCaseDeadlineReferenceId(
  oldLeadDocketNumber: string,
  newLeadDocketNumber: string,
): Promise<void> {
  const LEAD_DEADLINES = await getCaseDeadlinesByDocketNumber({
    docketNumber: oldLeadDocketNumber,
  });

  const TASKS = LEAD_DEADLINES.map(async (leadCaseDeadline: CaseDeadline) => {
    const { caseDeadlineId: oldLeadCaseDeadlineId } = leadCaseDeadline;
    const CHILD_DEADLINES = await getCaseDeadlinesByConsolidatedCaseDeadlineId(
      oldLeadCaseDeadlineId,
      oldLeadDocketNumber,
    );
    if (!CHILD_DEADLINES.length) return;

    const NEW_LEAD_CASE_DEADLINE = CHILD_DEADLINES.find(
      ({ docketNumber }) => docketNumber === newLeadDocketNumber,
    );

    const newLeadCaseDeadlineId =
      NEW_LEAD_CASE_DEADLINE?.caseDeadlineId || undefined;

    const UPDATED_CHILD_CASE_DEADLINES: RawCaseDeadline[] = CHILD_DEADLINES.map(
      (childCaseDeadline: RawCaseDeadline) => {
        return {
          ...childCaseDeadline,
          consolidatedCaseDeadlineId:
            childCaseDeadline.docketNumber === newLeadDocketNumber
              ? undefined
              : newLeadCaseDeadlineId,
        } as RawCaseDeadline;
      },
    );

    await upsertCaseDeadlines(UPDATED_CHILD_CASE_DEADLINES);
  });

  await Promise.all(TASKS);
}

const determineEntitiesToLock = (
  _applicationContext,
  { docketNumber, docketNumbersToRemove = [] },
) => {
  const docketNumbers = [docketNumber, ...docketNumbersToRemove].map(
    item => `case|${item}`,
  );

  return {
    identifiers: docketNumbers,
  };
};

export const removeConsolidatedCasesInteractor = withLocking(
  removeConsolidatedCases,
  determineEntitiesToLock,
);
