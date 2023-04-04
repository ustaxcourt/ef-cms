/**
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object used for passing props.date
 */
export const normalizeDateFormatAction = ({ applicationContext, props }) => {
  const { date } = props;
  const dateWithTime = applicationContext
    .getUtilities()
    .createISODateString(date, 'MM/dd/yyyy');
  return { date: dateWithTime };
};
