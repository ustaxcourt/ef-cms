import { UnauthorizedError } from '@web-api/errors/errors';
import {
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import { getCasesForUserInteractor } from './getCasesForUserInteractor';
import { calculateISODate } from '../utilities/DateHandler';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { getRecentFilingsByDocketNumbers } from '@web-api/persistence/postgres/docketEntries/getRecentFilingsByDocketNumbers';
import { userIsDirectlyAssociated } from '@shared/business/entities/cases/Case';

import { RecentFiling } from '@shared/business/entities/RecentFiling';
import { getCaseCaptionMeta } from '../utilities/getCaseCaptionMeta';

export const getRecentFilingsForUserInteractor = async (
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
  const today = calculateISODate({ howMuch: 0, units: 'days' });

  const dbDocketEntries = await getRecentFilingsByDocketNumbers({
    docketNumbers,
    startDate: sevenDaysAgo,
    endDate: today,
  });

  const results = dbDocketEntries.map(d => ({
    docketNumber: d.docketNumber,
    filingDate: d.filingDate?.toISOString(),
    documentTitle: d.documentTitle,
    docketEntryId: d.docketEntryId,
    isFileAttached: d.isFileAttached,
    eventCode: d.eventCode,
    isStricken: d.isStricken,
    isSealed: d.isSealed,
    sealedTo: d.sealedTo,
    servedAt: d.servedAt?.toISOString(),
    isDraft: d.isDraft,
    caseCaption: d.caption,
    caseIsSealed: d.caseIsSealed,
  }));

  // Get case details to check user association for consolidated cases
  const uniqueDocketNumbers = [...new Set(results.map(r => r.docketNumber))];
  const caseDetails = await getCasesByDocketNumbers({
    docketNumbers: uniqueDocketNumbers,
    excludeFields: ['docketEntries', 'hearings', 'correspondence'],
  });

  const caseDetailsMap = new Map();
  caseDetails.forEach(caseDetail => {
    caseDetailsMap.set(caseDetail.docketNumber, caseDetail);
  });

  const caseInfoMap = new Map();
  allUserCases.forEach(caseItem => {
    const hasConsolidatedCases = (caseItem.consolidatedCases?.length || 0) > 0;
    const isLeadCase =
      !caseItem.leadDocketNumber ||
      caseItem.leadDocketNumber === caseItem.docketNumber;
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
      isLeadCase,
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

  return results.map(entry => {
    const caseInfo = caseInfoMap.get(entry.docketNumber) || {
      inConsolidatedGroup: false,
      isLeadCase: true,
      consolidatedIconTooltipText: undefined,
    };
    const documentTitle = entry.documentTitle || 'Document';
    const caseCaptionMeta = getCaseCaptionMeta({
      caseCaption: entry.caseCaption,
    });
    const caseTitle = caseCaptionMeta?.caseTitle || 'Unknown Case';

    // Check if user is directly associated with this specific case
    const caseDetail = caseDetailsMap.get(entry.docketNumber);
    const isRequestingUserAssociated = caseDetail
      ? userIsDirectlyAssociated({
          aCase: caseDetail,
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
