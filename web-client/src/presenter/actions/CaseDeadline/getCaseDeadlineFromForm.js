import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * compute a case deadline
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.props the cerebral props object
 * @returns {object} the case deadline object
 */
export const getCaseDeadlineFromForm = ({ applicationContext, get, props }) => {
  let deadlineDate;

  if (props.computedDate) {
    deadlineDate = applicationContext
      .getUtilities()
      .createISODateString(props.computedDate);
  }

  const docketNumber = get(state.caseDetail.docketNumber);

  const caseDeadline = omit(
    {
      ...get(state.form),
      deadlineDate,
      docketNumber,
    },
    ['day', 'month', 'year', 'searchError'],
  );

  return caseDeadline;
};
