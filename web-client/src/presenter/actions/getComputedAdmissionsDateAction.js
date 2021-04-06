import { state } from 'cerebral';

/**
 * computes admissions date from form date values
 *
 * @param {string} prefix prefix for form state date field keys
 * @returns {Function} the primed action
 */
export const getComputedAdmissionsDateAction = ({
  applicationContext,
  get,
}) => {
  let formYear = get(state.form.year);
  let formMonth = get(state.form.moth);
  let formDay = get(state.form.day);

  let computedDate = null;

  computedDate = applicationContext.getUtilities().computeDate({
    day: formDay,
    month: formMonth,
    year: formYear,
  });

  if (
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

  return { computedDate };
};
