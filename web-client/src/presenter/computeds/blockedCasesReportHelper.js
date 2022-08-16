import { state } from 'cerebral';

export const blockedCasesReportHelper = (get, applicationContext) => {
  const blockedCases = get(state.blockedCases);
  const procedureTypeFilter = get(state.form.procedureType);

  let blockedCasesFormatted = [];

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
        return {
          ...setFormattedBlockDates(blockedCase),
          caseTitle: applicationContext.getCaseTitle(
            blockedCase.caseCaption || '',
          ),
          docketNumberWithSuffix: blockedCase.docketNumberWithSuffix,
        };
      })
      .filter(blockedCase => {
        return procedureTypeFilter && procedureTypeFilter !== 'All'
          ? blockedCase.procedureType === procedureTypeFilter
          : true;
      });
  }

  return {
    blockedCasesCount: blockedCasesFormatted && blockedCasesFormatted.length,
    blockedCasesFormatted,
  };
};
