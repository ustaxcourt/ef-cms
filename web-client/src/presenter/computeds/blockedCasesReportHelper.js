import { state } from 'cerebral';

export const blockedCasesReportHelper = (get, applicationContext) => {
  const blockedCases = get(state.blockedCases);

  let blockedCasesFormatted = [];
  if (blockedCases && blockedCases.length) {
    blockedCasesFormatted = blockedCases
      .sort(applicationContext.getUtilities().compareCasesByDocketNumber)
      .map(blockedCase => {
        return {
          ...blockedCase,
          blockedDateFormatted: applicationContext
            .getUtilities()
            .formatDateString(blockedCase.blockedDate, 'MMDDYY'),
          caseName: applicationContext.getCaseCaptionNames(
            blockedCase.caseCaption || '',
          ),
          docketNumberWithSuffix:
            blockedCase.docketNumber + (blockedCase.docketNumberSuffix || ''),
        };
      });
  }

  return {
    blockedCasesCount: blockedCases && blockedCases.length,
    blockedCasesFormatted,
  };
};
