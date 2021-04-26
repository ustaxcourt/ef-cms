import { state } from 'cerebral';

const computeAdmissionsDate = ({ applicationContext, day, month, year }) => {
  const { DATE_FORMATS } = applicationContext.getConstants();

  const inputProvided = day || month || year;
  if (!inputProvided) {
    return null;
  }
  const yyyyPadded = `${year}`.padStart(4, '0');
  const mmPadded = `${month}`.padStart(2, '0');
  const ddPadded = `${day}`.padStart(2, '0');
  const dateToParse = `${yyyyPadded}-${mmPadded}-${ddPadded}`;

  const preparedDateISO = applicationContext
    .getUtilities()
    .prepareDateFromString(dateToParse, DATE_FORMATS.YYYYMMDD);

  const yyyymmdd = applicationContext
    .getUtilities()
    .formatDateString(preparedDateISO, DATE_FORMATS.YYYYMMDD);

  return yyyymmdd;
};

/**
 * computes admissions date from form date values
 *
 * @returns {Object} the computed date
 */
export const getComputedAdmissionsDateAction = ({
  applicationContext,
  get,
}) => {
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
