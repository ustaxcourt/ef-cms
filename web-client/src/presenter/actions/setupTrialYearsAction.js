import { state } from 'cerebral';

/**
 * sets the state.modal.trialYears
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const setupTrialYearsAction = ({ applicationContext, store }) => {
  const currentYearString = applicationContext.getUtilities().formatNow('YEAR');
  const currentYearInt = parseInt(currentYearString);
  const currentYearPlus1 = `${currentYearInt + 1}`;
  const currentYearPlus2 = `${currentYearInt + 2}`;

  store.set(state.modal.trialYears, [
    currentYearString,
    currentYearPlus1,
    currentYearPlus2,
  ]);
};
