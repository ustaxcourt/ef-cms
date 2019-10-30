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
          caseName: applicationContext.getCaseCaptionNames(
            blockedCase.caseCaption || '',
          ),
          docketNumberWithSuffix:
            blockedCase.docketNumber + (blockedCase.docketNumberSuffix || ''),
          blockedDateFormatted: applicationContext
            .getUtilities()
            .formatDateString(blockedCase.blockedDate, 'MMDDYY'),
        };
      });
  }

  return {
    blockedCasesCount: blockedCases && blockedCases.length,
    blockedCasesFormatted,
  };
};
