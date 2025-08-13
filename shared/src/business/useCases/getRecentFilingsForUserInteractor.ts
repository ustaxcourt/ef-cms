import { UnauthorizedError } from '@web-api/errors/errors';
import {
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import { getCasesForUserInteractor } from './getCasesForUserInteractor';
import { calculateISODate, calculateDate } from '../utilities/DateHandler';
import { getDbReader } from '@web-api/database';

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

  const docketNumbers = allUserCases.map(caseItem => caseItem.docketNumber);
  const sevenDaysAgo = calculateISODate({ howMuch: -7, units: 'days' });
  const today = calculateISODate({ howMuch: 0, units: 'days' });

  // Query PostgreSQL for recent docket entries with case titles
  const dbDocketEntries = await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry as d')
      .innerJoin('dwCase as c', 'd.docketNumber', 'c.docketNumber')
      .select([
        'd.docketEntryId',
        'd.docketNumber',
        'd.filingDate',
        'd.documentTitle',
        'd.isFileAttached',
        'd.eventCode',
        'd.isStricken',
        'd.isSealed',
        'd.sealedTo',
        'd.servedAt',
        'c.caption',
      ])
      .where('d.docketNumber', 'in', docketNumbers)
      .where('d.filingDate', '>=', calculateDate({ dateString: sevenDaysAgo }))
      .where('d.filingDate', '<=', calculateDate({ dateString: today }))
      .where('d.isStricken', 'is not', true)
      .orderBy('d.filingDate', 'desc')
      .limit(1000)
      .execute(),
  );

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
    caseCaption: d.caption,
  }));

  // Build case info map for consolidated case handling
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
      consolidatedIconTooltipText = `Lead case in consolidated group with ${caseItem.consolidatedCases?.length || 0} member cases`;
    } else if (caseItem.leadDocketNumber) {
      consolidatedIconTooltipText = `Member case in consolidated group led by ${caseItem.leadDocketNumber}`;
    }

    caseInfoMap.set(caseItem.docketNumber, {
      inConsolidatedGroup,
      isLeadCase,
      consolidatedIconTooltipText,
    });
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
      inConsolidatedGroup: caseInfo.inConsolidatedGroup,
      isLeadCase: caseInfo.isLeadCase,
      consolidatedIconTooltipText: caseInfo.consolidatedIconTooltipText,
    };
  });
};
