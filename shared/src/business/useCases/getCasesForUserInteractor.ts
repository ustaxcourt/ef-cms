import {
  Case,
  isClosed,
  isLeadCase,
  userIsDirectlyAssociated,
} from '../entities/cases/Case';
import { UserCase } from '../entities/UserCase';
import { compareISODateStrings } from '../utilities/sortFunctions';
import { uniqBy } from 'lodash';

type TAssociatedCase = {
  isRequestingUserAssociated: boolean;
  consolidatedCases?: Case[];
} & Case;

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
  cases,
  userId,
}: {
  applicationContext: IApplicationContext;
  cases: TAssociatedCase[];
  userId: string;
}) {
  // Get all cases with a lead docket number and add "isRequestingUserAssociated" property
  const consolidatedGroups = (
    await Promise.all(
      uniqBy(
        cases.filter(aCase => aCase.leadDocketNumber),
        'leadDocketNumber',
      ).map(aCase =>
        applicationContext.getPersistenceGateway().getCasesByLeadDocketNumber({
          applicationContext,
          includeDocketEntries: false,
          leadDocketNumber: aCase.leadDocketNumber!,
        }),
      ),
    )
  )
    .flat()
    .map(aCase => {
      return {
        ...aCase,
        isRequestingUserAssociated: userIsDirectlyAssociated({ aCase, userId }),
      };
    });

  // Combine open cases and consolidated cases and remove duplicates
  const associatedAndUnassociatedCases = uniqBy(
    [...cases, ...consolidatedGroups],
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
      leadCase.consolidatedCases = leadCase.consolidatedCases ?? [];
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
 * @param {object} applicationContext the application context
 * @returns {object} A list of the open cases and a list of the closed cases for the user
 */
export const getCasesForUserInteractor = async (
  applicationContext: IApplicationContext,
) => {
  const { userId } = await applicationContext.getCurrentUser();

  let allUserCases = await applicationContext
    .getPersistenceGateway()
    .getCasesForUser({
      applicationContext,
      userId,
    });

  allUserCases = allUserCases.map(aCase => {
    return { ...aCase, isRequestingUserAssociated: true } as TAssociatedCase;
  });

  const nestedCases = await fetchConsolidatedGroupsAndNest({
    applicationContext,
    cases: allUserCases,
    userId,
  });

  const sortedOpenCases = sortAndFilterCases(nestedCases, 'open');

  const sortedClosedCases = sortAndFilterCases(nestedCases, 'closed');

  return { closedCaseList: sortedClosedCases, openCaseList: sortedOpenCases };
};

const sortAndFilterCases = (nestedCases, caseType: 'open' | 'closed') => {
  return nestedCases
    .map((c: any) => {
      // explicitly unset the entityName because this is returning a composite entity and if an entityName
      // is set, the genericHandler will send it through the entity constructor for that entity and strip
      // out necessary data
      c.entityName = undefined;
      return c;
    })
    .filter(nestedCase => {
      const caseStatusFilter = [
        nestedCase,
        ...(nestedCase.consolidatedCases || []),
      ].some(aCase =>
        caseType === 'open' ? !isClosed(aCase) : isClosed(aCase),
      );

      return caseStatusFilter;
    })
    .sort((a, b) => {
      if (caseType === 'closed') {
        const closedDateA = a.closedDate
          ? a.closedDate
          : a.consolidatedCases.find(aCase => aCase.closedDate).closedDate;
        const closedDateB = b.closedDate
          ? b.closedDate
          : b.consolidatedCases.find(aCase => aCase.closedDate).closedDate;
        return compareISODateStrings(closedDateB, closedDateA);
      } else {
        return compareISODateStrings(b.createdAt, a.createdAt);
      }
    })
    .map(nestedCase => ({
      ...new UserCase(nestedCase).toRawObject(),
      consolidatedCases: nestedCase.consolidatedCases
        ? nestedCase.consolidatedCases.map(consolidatedCase => ({
            ...new UserCase(consolidatedCase),
            isRequestingUserAssociated:
              consolidatedCase.isRequestingUserAssociated,
          }))
        : undefined,
      isRequestingUserAssociated: nestedCase.isRequestingUserAssociated,
    }));
};
