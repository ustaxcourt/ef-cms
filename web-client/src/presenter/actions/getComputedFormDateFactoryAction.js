import { state } from 'cerebral';

/**
 * sets the state.form[path] to whatever the computedDate value is from props
 *
 * @param {string} prefix prefix for form state date field keys
 * @param {boolean} toIsoString cast the computedDate as an ISO string
 * @param {string} stateKey the key for computedDate value
 * @returns {Function} the primed action
 */
export const getComputedFormDateFactoryAction = (
  prefix,
  toIsoString,
  stateKey = 'computedDate',
) => {
  /**
   * computes the date given either a prefix or the default of day, month, year props on the form
   *
   * @param {object} providers the providers object
   * @param {object} providers.applicationContext application context for getting date utility functions
   * @param {object} providers.get the cerebral get function
   * @returns {object} computedDate
   */
  const computeFormDateAction = ({ applicationContext, get }) => {
    let formYear;
    let formMonth;
    let formDay;
    let computedDate = null;

    if (prefix) {
      formYear = get(state.form[`${prefix}Year`]);
      formMonth = get(state.form[`${prefix}Month`]);
      formDay = get(state.form[`${prefix}Day`]);
    } else {
      formYear = get(state.form.year);
      formMonth = get(state.form.month);
      formDay = get(state.form.day);
    }

    computedDate = applicationContext.getUtilities().computeDate({
      day: formDay,
      month: formMonth,
      year: formYear,
    });

    if (
      toIsoString &&
      applicationContext
        .getUtilities()
        .isValidDateString(`${formMonth}-${formDay}-${formYear}`)
    ) {
      computedDate = applicationContext
        .getUtilities()
        .createISODateStringFromObject({
          day: formDay,
          month: formMonth,
          year: formYear,
        });
    }

    return { [stateKey]: computedDate };
  };

  return computeFormDateAction;
};
