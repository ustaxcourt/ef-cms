import {
  Case,
  isClosed,
  isLeadCase,
  userIsDirectlyAssociated,
} from '../entities/cases/Case';
import { PaymentStatusTypes } from '@shared/business/entities/EntityConstants';
import { RawUserCase } from '../entities/UserCase';
import { UserCaseDTO } from '@shared/business/entities/UserCaseDTO';
import { compareISODateStrings } from '../utilities/sortFunctions';
import { partition, uniqBy } from 'lodash';

export type TAssociatedCase = {
  isRequestingUserAssociated: boolean;
  consolidatedCases?: TAssociatedCase[];
  petitionPaymentStatus: PaymentStatusTypes;
} & Omit<RawUserCase, 'entityName'>;

export const getCasesForUserInteractor = async (
  applicationContext: IApplicationContext,
): Promise<{
  openCaseList: TAssociatedCase[];
  closedCaseList: TAssociatedCase[];
}> => {
  const { userId } = await applicationContext.getCurrentUser();

  const docketNumbers = (
    await applicationContext.getPersistenceGateway().getCasesForUser({
      applicationContext,
      userId,
    })
  ).map(c => c.docketNumber);

  const allUserCases: TAssociatedCase[] = Case.validateRawCollection(
    await applicationContext.getPersistenceGateway().getCasesByDocketNumbers({
      applicationContext,
      docketNumbers,
    }),
    { applicationContext },
  ).map(c => {
    return new UserCaseDTO({ ...c, isRequestingUserAssociated: true });
  });

  const nestedCases = await fetchConsolidatedGroupsAndNest({
    applicationContext,
    cases: allUserCases,
    userId,
  });

  const [openCases, closedCases] = partition(nestedCases, aCase => {
    return [aCase, ...(aCase.consolidatedCases || [])].some(c => !isClosed(c));
  });

  console.log(openCases, closedCases);

  const sortedOpenCases = sortCases(openCases, 'open');
  const sortedClosedCases = sortCases(closedCases, 'closed');

  return { closedCaseList: sortedClosedCases, openCaseList: sortedOpenCases };
};

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
}): Promise<TAssociatedCase[]> {
  const consolidatedGroups = await getAllConsolidatedCases(
    applicationContext,
    cases,
    userId,
  );

  // Combine open cases and consolidated cases and remove duplicates
  const allCasesAndConsolidatedCases = uniqBy(
    [...cases, ...consolidatedGroups],
    aCase => aCase.docketNumber,
  ).map(aCase => ({
    ...aCase,
    consolidatedCases: (aCase.consolidatedCases || []) as TAssociatedCase[],
  }));

  const [topLevelCases, memberConsolidatedCases] = partition(
    allCasesAndConsolidatedCases,
    aCase => isTopLevelCase(aCase),
  );

  memberConsolidatedCases.forEach(mCase => {
    const topCase = topLevelCases.find(
      c => c.docketNumber === mCase.leadDocketNumber,
    )!;

    topCase.consolidatedCases.push(mCase);
  });

  // Sort consolidated cases by docket number and return all cases
  const allCases = topLevelCases.map(aCase => {
    return {
      ...aCase,
      consolidatedCases: aCase.consolidatedCases
        ? Case.sortByDocketNumber(aCase.consolidatedCases)
        : undefined,
    };
  });

  return allCases;
}

const sortCases = (
  nestedCases: TAssociatedCase[],
  caseType: 'open' | 'closed',
): TAssociatedCase[] => {
  return nestedCases
    .sort((a, b) => {
      if (caseType === 'closed') {
        return compareISODateStrings(b.closedDate, a.closedDate);
      } else {
        return compareISODateStrings(b.createdAt, a.createdAt);
      }
    })
    .map(nestedCase => ({
      ...new UserCaseDTO(nestedCase),
      consolidatedCases: nestedCase.consolidatedCases
        ? nestedCase.consolidatedCases.map(consolidatedCase => {
            return new UserCaseDTO(consolidatedCase);
          })
        : undefined,
    }));
};

async function getAllConsolidatedCases(
  applicationContext: IApplicationContext,
  cases: TAssociatedCase[],
  userId: string,
): Promise<(RawCase & { isRequestingUserAssociated: boolean })[]> {
  const uniqueLeadDocketNumbers = uniqBy(
    cases.filter(aCase => aCase.leadDocketNumber),
    'leadDocketNumber',
  );

  return (
    await Promise.all(
      uniqueLeadDocketNumbers.map(aCase =>
        applicationContext
          .getPersistenceGateway()
          .getCasesMetadataByLeadDocketNumber({
            applicationContext,
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
}

function isSoloCase(aCase: { leadDocketNumber?: string }): boolean {
  return !aCase.leadDocketNumber;
}

function isTopLevelCase(aCase: {
  docketNumber: string;
  leadDocketNumber?: string;
}): boolean {
  return isLeadCase(aCase) || isSoloCase(aCase);
}
