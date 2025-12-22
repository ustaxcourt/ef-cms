import { UnauthorizedError } from '@web-api/errors/errors';
import {
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import { getCasesForUserInteractor } from './getCasesForUserInteractor';
import { calculateISODate, createEndOfDayISO } from '../utilities/DateHandler';
import { userIsDirectlyAssociated, isLeadCase } from '@shared/business/entities/cases/Case';

import { getCaseCaptionMeta } from '../utilities/getCaseCaptionMeta';

export interface RecentFiling {
  docketNumber: string;
  filedDate: string;
  document: string;
  caseTitle: string;
  docketEntryId: string;
  isFileAttached?: boolean | null;
  eventCode?: string;
  isStricken?: boolean | null;
  isSealed?: boolean | null;
  sealedTo?: string | null;
  servedAt?: string;
  caseIsSealed?: boolean | null;
  inConsolidatedGroup?: boolean;
  isLeadCase?: boolean;
  consolidatedIconTooltipText?: string;
  isDraft?: boolean;
  isRequestingUserAssociated?: boolean;
}

export const getRecentFilingsForUserInteractor = async (
  applicationContext: any,
  authorizedUser: UnknownAuthUser,
): Promise<RecentFiling[]> => {
  if (!isAuthUser(authorizedUser)) {
    throw new UnauthorizedError(
      'Invalid User attempting to get recent filings',
    );
  }

  const { openCaseList, closedCaseList } =
    await getCasesForUserInteractor(authorizedUser);

  const allUserCases = [...openCaseList, ...closedCaseList];

  if (allUserCases.length === 0) {
    return [];
  }

  const docketNumbers = allUserCases.reduce((acc, caseItem) => {
    acc.push(caseItem.docketNumber);
    if (caseItem.consolidatedCases) {
      caseItem.consolidatedCases.forEach(consolidatedCase => {
        acc.push(consolidatedCase.docketNumber);
      });
    }
    return acc;
  }, [] as string[]);

  const sevenDaysAgo = calculateISODate({ howMuch: -7, units: 'days' });
  const endOfToday = createEndOfDayISO();

  const recentFilingsWithUserAssociation = await applicationContext
    .getPersistenceGateway()
    .getRecentFilingsByDocketNumbers({
      docketNumbers,
      startDate: sevenDaysAgo,
      endDate: endOfToday,
      includeCaseDetails: true,
    });

  const caseInfoMap = new Map();
  allUserCases.forEach(caseItem => {
    const hasConsolidatedCases = (caseItem.consolidatedCases?.length || 0) > 0;
    const isLeadCaseResult =
      !caseItem.leadDocketNumber ||
      isLeadCase(caseItem);
    const inConsolidatedGroup =
      hasConsolidatedCases || caseItem.leadDocketNumber;

    let consolidatedIconTooltipText: string | undefined;
    if (hasConsolidatedCases) {
      consolidatedIconTooltipText = 'Lead case';
    } else if (caseItem.leadDocketNumber) {
      consolidatedIconTooltipText = 'Consolidated case';
    }

    caseInfoMap.set(caseItem.docketNumber, {
      inConsolidatedGroup,
      isLeadCase: isLeadCaseResult,
      consolidatedIconTooltipText,
    });

    if (caseItem.consolidatedCases) {
      caseItem.consolidatedCases.forEach(consolidatedCase => {
        caseInfoMap.set(consolidatedCase.docketNumber, {
          inConsolidatedGroup: true,
          isLeadCase: false,
          consolidatedIconTooltipText: 'Consolidated case',
        });
      });
    }
  });

  return recentFilingsWithUserAssociation.map(entry => {
    const caseInfo = caseInfoMap.get(entry.docketNumber) || {
      inConsolidatedGroup: false,
      isLeadCase: true,
      consolidatedIconTooltipText: undefined,
    };
    const documentTitle = entry.documentTitle || 'Document';
    const caseCaptionMeta = getCaseCaptionMeta({
      caseCaption: entry.caption,
    });
    const caseTitle = caseCaptionMeta?.caseTitle || 'Unknown Case';

    // Check if user is directly associated with this specific case
    const isRequestingUserAssociated = entry.caseDetails
      ? userIsDirectlyAssociated({
          aCase: entry.caseDetails,
          userId: authorizedUser.userId,
        })
      : true; // Default to true if case details not found (shouldn't happen)

    return {
      docketNumber: entry.docketNumber,
      filedDate: entry.filingDate,
      document: documentTitle,
      caseTitle,
      docketEntryId: entry.docketEntryId,
      isFileAttached: entry.isFileAttached,
      eventCode: entry.eventCode,
      isStricken: entry.isStricken,
      isSealed: entry.isSealed,
      sealedTo: entry.sealedTo,
      servedAt: entry.servedAt,
      caseIsSealed: entry.caseIsSealed,
      inConsolidatedGroup: caseInfo.inConsolidatedGroup,
      isLeadCase: caseInfo.isLeadCase,
      consolidatedIconTooltipText: caseInfo.consolidatedIconTooltipText,
      isRequestingUserAssociated,
    };
  });
};
