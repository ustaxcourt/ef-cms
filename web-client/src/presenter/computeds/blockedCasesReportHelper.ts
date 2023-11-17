import { state } from '@web-client/presenter/app.cerebral';

/**
 * gets the blocked cases and formats them and filters based on procedureType
 * @param {Function} get the cerebral get function used
 * for getting state.form.procedureType and state.blockedCases
 * @param {object} applicationContext the application context
 * @returns {object} {blockedCasesFormatted: *[], blockedCasesCount: number}
 */
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const blockedCasesReportHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const blockedCases = get(state.blockedCases);
  const procedureTypeFilter = get(state.form.procedureType);

  let blockedCasesFormatted = [];
  let displayMessage;

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
        const blockedCaseWithConsolidatedProperties = applicationContext
          .getUtilities()
          .setConsolidationFlagsForDisplay(blockedCase);
        return {
          ...setFormattedBlockDates(blockedCaseWithConsolidatedProperties),
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

  if (blockedCasesFormatted.length === 0) {
    displayMessage = 'There are no blocked cases for this location.';

    if (procedureTypeFilter && procedureTypeFilter !== 'All') {
      displayMessage = 'There are no blocked cases for this case type.';
    }
  }

  return {
    blockedCasesCount: blockedCasesFormatted.length,
    blockedCasesFormatted,
    displayMessage,
  };
};
