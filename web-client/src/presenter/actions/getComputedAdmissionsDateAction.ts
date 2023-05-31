import { state } from 'cerebral';

const computeAdmissionsDate = ({ applicationContext, day, month, year }) => {
  const { DATE_FORMATS } = applicationContext.getConstants();

  const inputProvided = day && month && year;
  if (!inputProvided) {
    return null;
  }

  const preparedDateISO = applicationContext
    .getUtilities()
    .createStartOfDayISO({
      day,
      month,
      year,
    });

  const yyyymmdd = applicationContext
    .getUtilities()
    .formatDateString(preparedDateISO, DATE_FORMATS.YYYYMMDD);

  return yyyymmdd;
};

/**
 * computes admissions date from form date values
 * @returns {Object} the computed date
 */
export const getComputedAdmissionsDateAction = ({
  applicationContext,
  get,
}: ActionProps) => {
  let formYear = get(state.form.year);
  let formMonth = get(state.form.month);
  let formDay = get(state.form.day);

  const computedDate = computeAdmissionsDate({
    applicationContext,
    day: formDay,
    month: formMonth,
    year: formYear,
  });

  return { computedDate };
};
