import { state } from 'cerebral';

/**
 * gets the edit statistic form helper fields
 *
 * @param {Function} get the cerebral get function
 * @param {object} applicationContext the application context
 * @returns {object} edit statistic form helper fields
 */
export const editStatisticFormHelper = (get, applicationContext) => {
  const { CASE_TYPES_MAP } = applicationContext.getConstants();
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);
  const statisticsRequired =
    caseDetail.caseType === CASE_TYPES_MAP.deficiency &&
    caseDetail.hasVerifiedIrsNotice === true;

  let showDelete = true;
  if (
    statisticsRequired &&
    caseDetail.statistics &&
    caseDetail.statistics.length === 1
  ) {
    showDelete = false;
  }

  const headerDateDisplay =
    form.year ||
    applicationContext
      .getUtilities()
      .formatDateString(form.lastDateOfPeriod, 'MMDDYY');

  return {
    headerDateDisplay,
    showDelete,
  };
};
