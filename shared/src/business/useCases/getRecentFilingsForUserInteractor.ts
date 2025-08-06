import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import {
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import { getCasesForUserInteractor } from './getCasesForUserInteractor';
import { calculateISODate } from '../utilities/DateHandler';
import { search } from '@web-api/persistence/elasticsearch/searchClient';
import { RecentFiling } from '@shared/business/entities/RecentFiling';

export const getRecentFilingsForUserInteractor = async (
  applicationContext: ServerApplicationContext,
  authorizedUser: UnknownAuthUser,
): Promise<RecentFiling[]> => {
  if (!isAuthUser(authorizedUser)) {
    throw new UnauthorizedError(
      'Invalid User attempting to get recent filings',
    );
  }

  const { openCaseList, closedCaseList } = await getCasesForUserInteractor(
    applicationContext,
    authorizedUser,
  );

  const allUserCases = [...openCaseList, ...closedCaseList];

  if (allUserCases.length === 0) {
    return [];
  }

  const docketNumbers = allUserCases.map(caseItem => caseItem.docketNumber);
  const sevenDaysAgo = calculateISODate({ howMuch: -7, units: 'days' });
  const today = calculateISODate({ howMuch: 0, units: 'days' });

  const searchQuery = {
    applicationContext,
    searchParameters: {
      body: {
        _source: [
          'docketNumber.S',
          'filingDate.S',
          'documentTitle.S',
          'caseCaption.S',
          'docketEntryId.S',
          'isFileAttached.BOOL',
          'eventCode.S',
          'isStricken.BOOL',
          'isSealed.BOOL',
          'sealedTo.S',
          'servedAt.S',
        ],
        query: {
          bool: {
            must: [
              {
                terms: {
                  'docketNumber.S': docketNumbers,
                },
              },
              {
                range: {
                  'filingDate.S': {
                    gte: sevenDaysAgo,
                    lte: today,
                  },
                },
              },
            ],
            must_not: [
              {
                term: {
                  'isStricken.BOOL': true,
                },
              },
            ],
          },
        },
        sort: [
          {
            'filingDate.S': {
              order: 'desc' as const,
            },
          },
        ],
        size: 1000,
      },
      index: 'efcms-docket-entry',
    },
  };

  const { results } = await search(searchQuery);

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
    const caseInfo = caseInfoMap.get(entry.docketNumber) || {};
    return {
      docketNumber: entry.docketNumber,
      filedDate: entry.filingDate,
      document: entry.documentTitle || 'Document',
      caseTitle: entry.caseCaption || 'Unknown Case',
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
