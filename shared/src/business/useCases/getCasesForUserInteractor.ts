/* eslint-disable @miovision/disallow-date/no-new-date */
import {
  Case,
  isClosed,
  isLeadCase,
  userIsDirectlyAssociated,
} from '../entities/cases/Case';
import { PaymentStatusTypes } from '@shared/business/entities/EntityConstants';
import { compareISODateStrings } from '../utilities/sortFunctions';
import { partition, uniqBy } from 'lodash';

interface UserCaseDTO {
  caseCaption: string;
  closedDate?: string;
  createdAt: string;
  docketNumber: string;
  docketNumberWithSuffix?: string;
  leadDocketNumber?: string;
  petitionPaymentStatus: PaymentStatusTypes;
  status: string;
}

export type TAssociatedCase = {
  isRequestingUserAssociated: boolean;
  consolidatedCases?: TAssociatedCase[];
  petitionPaymentStatus: PaymentStatusTypes;
} & UserCaseDTO;

export const getCasesForUserInteractor = async (
  applicationContext: IApplicationContext,
): Promise<{
  openCaseList: TAssociatedCase[];
  closedCaseList: TAssociatedCase[];
}> => {
  const { userId } = await applicationContext.getCurrentUser();

  const start = new Date().getTime();

  const docketNumbers = (
    await applicationContext.getPersistenceGateway().getCasesForUser({
      applicationContext,
      userId,
    })
  ).map(c => c.docketNumber);

  // 394 ms
  applicationContext.logger.info('done getting docket numbers for user', {
    elapsed: new Date().getTime() - start,
  });

  const allUserCasesStart: any[] = await applicationContext
    .getPersistenceGateway()
    .getCasesByDocketNumbers({
      applicationContext,
      docketNumbers,
    });

  applicationContext.logger.info('done getting user cases', {
    elapsed: new Date().getTime() - start,
  });

  const validatedCases = Case.validateRawCollection(allUserCasesStart, {
    applicationContext,
  });

  applicationContext.logger.info('done validating user cases', {
    elapsed: new Date().getTime() - start,
  });

  const allUserCasesEnd: TAssociatedCase[] = validatedCases.map(c => {
    return { ...convertCaseToUserCaseDTO(c), isRequestingUserAssociated: true };
  });

  // 25,329 ms
  applicationContext.logger.info('done processing user cases', {
    elapsed: new Date().getTime() - start,
  });

  const nestedCases = await fetchConsolidatedGroupsAndNest({
    applicationContext,
    cases: allUserCasesEnd,
    userId,
  });

  // 26,054 ms
  applicationContext.logger.info('done getting nestedCases', {
    elapsed: new Date().getTime() - start,
  });

  const openCases = nestedCases.filter(nestedCase => {
    return [nestedCase, ...(nestedCase.consolidatedCases || [])].some(
      aCase => !isClosed(aCase),
    );
  });

  const closedCases = nestedCases.filter(nestedCase => {
    return [nestedCase, ...(nestedCase.consolidatedCases || [])].some(aCase =>
      isClosed(aCase),
    );
  });

  const sortedOpenCases = sortCases(openCases, 'open');
  const sortedClosedCases = sortCases(closedCases, 'closed');

  // 26,078 ms
  applicationContext.logger.info('done processing', {
    elapsed: new Date().getTime() - start,
  });

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
      consolidatedCases: aCase.consolidatedCases.length
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
        const closedDateA = a.closedDate
          ? a.closedDate
          : a.consolidatedCases?.find(aCase => aCase.closedDate)!.closedDate;
        const closedDateB = b.closedDate
          ? b.closedDate
          : b.consolidatedCases?.find(aCase => aCase.closedDate)!.closedDate;
        return compareISODateStrings(closedDateB, closedDateA);
      } else {
        return compareISODateStrings(b.createdAt, a.createdAt);
      }
    })
    .map(c => ({
      ...convertCaseToUserCaseDTO(c),
      consolidatedCases: c.consolidatedCases
        ? c.consolidatedCases.map(consolidatedCase => {
            return {
              ...convertCaseToUserCaseDTO(consolidatedCase),
              isRequestingUserAssociated:
                consolidatedCase.isRequestingUserAssociated,
            };
          })
        : undefined,
      isRequestingUserAssociated: c.isRequestingUserAssociated,
    }));
};

function convertCaseToUserCaseDTO(rawCase: UserCaseDTO): UserCaseDTO {
  const userCaseDTO: UserCaseDTO = {
    caseCaption: rawCase.caseCaption,
    closedDate: rawCase.closedDate,
    createdAt: rawCase.createdAt,
    docketNumber: rawCase.docketNumber,
    docketNumberWithSuffix: rawCase.docketNumberWithSuffix,
    leadDocketNumber: rawCase.leadDocketNumber,
    petitionPaymentStatus: rawCase.petitionPaymentStatus,
    status: rawCase.status,
  };
  return userCaseDTO;
}

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
