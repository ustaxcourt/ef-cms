import { state } from 'cerebral';

export const blockedCasesReportHelper = (get, applicationContext) => {
  const blockedCases = get(state.blockedCases);

  let blockedCasesFormatted = [];
  let consolidatedIconTooltipText = null;

  const setFormattedBlockDates = blockedCase => {
    if (blockedCase.blockedDate && blockedCase.automaticBlocked) {
      if (blockedCase.blockedDate < blockedCase.automaticBlockedDate) {
        blockedCase.blockedDateEarliest = applicationContext
          .getUtilities()
          .formatDateString(blockedCase.blockedDate, 'MMDDYY');
      } else {
        blockedCase.blockedDateEarliest = applicationContext
          .getUtilities()
          .formatDateString(blockedCase.automaticBlockedDate, 'MMDDYY');
      }
    } else if (blockedCase.blocked) {
      blockedCase.blockedDateEarliest = applicationContext
        .getUtilities()
        .formatDateString(blockedCase.blockedDate, 'MMDDYY');
    } else if (blockedCase.automaticBlocked) {
      blockedCase.blockedDateEarliest = applicationContext
        .getUtilities()
        .formatDateString(blockedCase.automaticBlockedDate, 'MMDDYY');
    }
    return blockedCase;
  };

  if (blockedCases && blockedCases.length) {
    blockedCasesFormatted = blockedCases
      .sort(applicationContext.getUtilities().compareCasesByDocketNumber)
      .map(blockedCase => {
        const inConsolidatedGroup = !!blockedCase.leadDocketNumber;
        const inLeadCase =
          inConsolidatedGroup &&
          blockedCase.leadDocketNumber === blockedCase.docketNumber;

        if (inConsolidatedGroup) {
          if (inLeadCase) {
            consolidatedIconTooltipText = 'Lead case';
          } else {
            consolidatedIconTooltipText = 'Consolidated case';
          }
        }

        return {
          ...setFormattedBlockDates(blockedCase),
          caseTitle: applicationContext.getCaseTitle(
            blockedCase.caseCaption || '',
          ),
          consolidatedIconTooltipText,
          docketNumberWithSuffix: blockedCase.docketNumberWithSuffix,
          inConsolidatedGroup,
          inLeadCase,
        };
      });
  }

  return {
    blockedCasesCount: blockedCases && blockedCases.length,
    blockedCasesFormatted,
  };
};
