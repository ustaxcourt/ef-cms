import { state } from '@web-client/presenter/app.cerebral';

/**
 * gets the statistics form helper fields
 *
 * @param {Function} get the cerebral get function
 * @param {object} applicationContext the application context
 * @returns {object} statistics form helper fields
 */
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const statisticsFormHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const { CASE_TYPES_MAP, PENALTY_TYPES } = applicationContext.getConstants();
  const form = get(state.form);

  const penaltyAmountType =
    get(state.modal.key) === 'irsTotalPenalties'
      ? PENALTY_TYPES.IRS_PENALTY_AMOUNT
      : PENALTY_TYPES.DETERMINATION_PENALTY_AMOUNT;

  const showStatisticsForm =
    form.caseType === CASE_TYPES_MAP.deficiency && form.hasVerifiedIrsNotice;

  const showAddMoreStatisticsButton =
    form.statistics && form.statistics.length < 12;

  const statisticOptions = [];

  (form.statistics || []).forEach(statistic => {
    if (statistic.yearOrPeriod === 'Year') {
      statisticOptions.push({ showYearInput: true });
    } else {
      statisticOptions.push({ showPeriodInput: true });
    }
  });

  const penalties = get(state.modal.penalties);
  const showAddAnotherPenaltyButton = penalties && penalties.length < 10;

  return {
    penaltyAmountType,
    showAddAnotherPenaltyButton,
    showAddMoreStatisticsButton,
    showStatisticsForm,
    statisticOptions,
  };
};
