import { Case, isClosed, isLeadCase } from '../entities/cases/Case';
import { UserCase } from '../entities/UserCase';
import { compareISODateStrings } from '../utilities/sortFunctions';
import { partition, uniqBy } from 'lodash';

type TAssociatedCase = {
  isRequestingUserAssociated: boolean;
  consolidatedCases?: TCase[];
} & TCase;

/**
 * This function will take in an array of cases, fetch all cases part of a consolidated group,
 * and restructure the object so that the lead cases are at the top level and all cases of that group will be nested inside a
 * consolidatedCases property. For example:
 *
 * [
 *  {docketNumber: '102-20', leadDocketNumber: '101-20}
 * ]
 *
 * will become
 *
 * [
 *  {
 *    docketNumber: '101-20',
 *    consolidatedCases: [
 *      {docketNumber: '102-20', leadDocketNumber: '101-20}
 *    ]
 *  }
 * ]
 */
async function fetchConsolidatedGroupsAndNest({
  applicationContext,
  openCases,
}: {
  applicationContext: IApplicationContext;
  openCases: TAssociatedCase[];
}) {
  // Get all cases with a lead docket number and add "isRequestingUserAssociated" property
  const consolidatedGroups = (
    await Promise.all(
      openCases
        .filter(aCase => aCase.leadDocketNumber)
        .map(aCase =>
          applicationContext
            .getPersistenceGateway()
            .getCasesByLeadDocketNumber({
              applicationContext,
              leadDocketNumber: aCase.docketNumber,
            }),
        ),
    )
  )
    .flat()
    .map(c => ({ ...c, isRequestingUserAssociated: false }));

  // Combine open cases and consolidated cases and remove duplicates
  const associatedAndUnassociatedCases = uniqBy(
    [...openCases, ...consolidatedGroups],
    aCase => aCase.docketNumber,
  );

  // Create a map of all cases, filtered by whether they're a lead case or not
  const caseMap: Record<string, TAssociatedCase> =
    associatedAndUnassociatedCases
      .filter(
        aCase =>
          isLeadCase(aCase) || (!isLeadCase(aCase) && !aCase.leadDocketNumber),
      )
      .reduce(
        (obj, aCase) => ({
          ...obj,
          [aCase.docketNumber]: aCase,
        }),
        {},
      );

  // Add consolidated cases to their lead case
  associatedAndUnassociatedCases
    .filter(aCase => !isLeadCase(aCase) && aCase.leadDocketNumber)
    .forEach(aCase => {
      const leadCase = caseMap[aCase.leadDocketNumber];
      leadCase.consolidatedCases = leadCase.consolidatedCases || [];
      leadCase.consolidatedCases.push(aCase);
    });

  // Sort consolidated cases by docket number and return all cases
  const allCases = Object.values(caseMap).map(aCase => {
    return {
      ...aCase,
      consolidatedCases: aCase.consolidatedCases
        ? Case.sortByDocketNumber(aCase.consolidatedCases)
        : undefined,
    };
  });

  return allCases;
}

/**
 * getCasesForUserInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {object} A list of the open cases and a list of the closed cases for the user
 */
export const getCasesForUserInteractor = async (
  applicationContext: IApplicationContext,
) => {
  const { userId } = await applicationContext.getCurrentUser();

  const allUserCases = await applicationContext
    .getPersistenceGateway()
    .getCasesForUser({
      applicationContext,
      userId,
    });

  const allUserCasesWithAssociations = UserCase.validateRawCollection(
    allUserCases,
    {
      applicationContext,
    },
  ) as TCaseEntity[];

  const [openCases, closedCases] = partition(
    allUserCasesWithAssociations.map(
      aCase =>
        ({ ...aCase, isRequestingUserAssociated: true } as TAssociatedCase),
    ),
    aCase => !isClosed(aCase),
  );

  const nestedOpenCases = await fetchConsolidatedGroupsAndNest({
    applicationContext,
    openCases,
  });

  const sortedOpenCases: any[] = Object.values(nestedOpenCases)
    .map((c: any) => {
      // explicitly unset the entityName because this is returning a composite entity and if an entityName
      // is set, the genericHandler will send it through the entity constructor for that entity and strip
      // out necessary data
      c.entityName = undefined;
      return c;
    })
    .sort((a, b) => compareISODateStrings(a.createdAt, b.createdAt))
    .reverse();

  const sortedClosedCases = closedCases
    .sort((a, b) => compareISODateStrings(a.closedDate, b.closedDate))
    .reverse();

  return { closedCaseList: sortedClosedCases, openCaseList: sortedOpenCases };
};
