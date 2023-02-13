import { Case, isClosed, isLeadCase } from '../entities/cases/Case';
import { UserCase } from '../entities/UserCase';
import { compareISODateStrings } from '../utilities/sortFunctions';
import { partition, uniqBy } from 'lodash';

type TAssociatedCase = {
  isRequestingUserAssociated: boolean;
  consolidatedCases?: TCase[];
} & TCase;

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

  const consolidatedGroups = (
    await Promise.all(
      openCases
        .filter(aCase => aCase.leadDocketNumber)
        .map(aCase => {
          return applicationContext
            .getPersistenceGateway()
            .getCasesByLeadDocketNumber({
              applicationContext,
              leadDocketNumber: aCase.docketNumber,
            });
        }),
    )
  )
    .flat()
    .map(
      aCase =>
        ({ ...aCase, isRequestingUserAssociated: false } as TAssociatedCase),
    );

  const associatedAndUnassociatedCases = uniqBy(
    openCases.concat(consolidatedGroups),
    aCase => aCase.docketNumber,
  );

  const caseMap: Record<string, TAssociatedCase> =
    associatedAndUnassociatedCases
      .filter(
        aCase =>
          isLeadCase(aCase) || (!isLeadCase(aCase) && !aCase.leadDocketNumber),
      )
      .reduce((obj, aCase) => {
        return {
          ...obj,
          [aCase.docketNumber]: aCase,
        };
      }, {});

  associatedAndUnassociatedCases
    .filter(aCase => !isLeadCase(aCase) && aCase.leadDocketNumber)
    .forEach(aCase => {
      const leadCase = caseMap[aCase.leadDocketNumber];
      if (leadCase.consolidatedCases === undefined)
        leadCase.consolidatedCases = [];
      leadCase.consolidatedCases.push(aCase);
    });

  const allCases = Object.values(caseMap).map(aCase => {
    return {
      ...aCase,
      consolidatedCases: aCase.consolidatedCases
        ? Case.sortByDocketNumber(aCase.consolidatedCases)
        : undefined,
    };
  });

  const foundOpenCases: any[] = Object.values(allCases)
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

  return { closedCaseList: sortedClosedCases, openCaseList: foundOpenCases };
};
