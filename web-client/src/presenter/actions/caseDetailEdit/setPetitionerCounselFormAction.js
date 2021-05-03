import { state } from 'cerebral';

/**
 * computes the date from a month, day and year value
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 * @returns {object} props object
 */
export const setPetitionerCounselFormAction = ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const caseDetail = get(state.caseDetail);
  const { barNumber } = props;

  // get petitioner connsel info from privatePractitioners via barNumber (filter / find?)
};
