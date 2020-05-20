import { state } from 'cerebral';

/**
 * gets the statistics form helper fields
 *
 * @param {Function} get the cerebral get function used
 * for getting state.form.partyType and state.constants
 * @param {object} applicationContext the application context
 * @returns {object} partyTypes constant, showPrimary/SecondaryContact,
 * showOwnershipDisclosureStatement, and ownershipDisclosureStatementDocumentId
 */
export const statisticsFormHelper = (get, applicationContext) => {
  const { CASE_TYPES_MAP } = applicationContext.getConstants();
  const form = get(state.form);

  const showStatisticsForm =
    form.caseType === CASE_TYPES_MAP.deficiency && form.hasVerifiedIrsNotice;

  const showAddMoreStatisticsButton =
    form.statistics && form.statistics.length < 12;

  const statisticOptions = [];

  (form.statistics || []).forEach(statistic => {
    if (statistic.yearOrPeriod === 'Year') {
      statisticOptions.push({ showYearInput: true });
    } else if (statistic.yearOrPeriod === 'Period') {
      statisticOptions.push({ showPeriodInput: true });
    }
  });

  const getErrorText = (validationErrors, index) => {
    if (!Array.isArray(validationErrors.statistics))
      return validationErrors.statistics;

    const error = validationErrors.statistics.find(s => s.index === index);

    return (
      error &&
      [
        error.lastDateOfPeriod,
        error.year,
        error.deficiencyAmount,
        error.totalPenalties,
      ]
        .filter(s => s)
        .join(', ')
    );
  };

  return {
    getErrorText,
    showAddMoreStatisticsButton,
    showStatisticsForm,
    statisticOptions,
  };
};
