/**
 * Formats a given date from props to YYYY-MM-DD format
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 *  @param {object} providers.props the cerebral props
 * @returns {object} date formatted as YYYY-MM-DD
 */
export const formatDateToYYYMMDDAction = ({ applicationContext, props }) => {
  const { DATE_FORMATS } = applicationContext.getConstants();

  const dateToFormat = applicationContext
    .getUtilities()
    .prepareDateFromString(props.value, DATE_FORMATS.MMDDYYYY);

  const formattedDate = applicationContext
    .getUtilities()
    .formatDateString(dateToFormat, DATE_FORMATS.YYYYMMDD);

  return {
    value: formattedDate,
  };
};
