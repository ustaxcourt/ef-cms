import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * compute a case deadline
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.props the cerebral props object
 * @returns {object}
 */
export const getCaseDeadlineFromForm = ({ applicationContext, get, props }) => {
  const deadlineDate = applicationContext
    .getUtilities()
    .prepareDateFromString(props.computedDate);

  const caseId = get(state.caseDetail.caseId);

  const caseDeadline = omit(
    {
      ...get(state.form),
      deadlineDate,
      caseId,
    },
    ['day', 'month', 'year'],
  );

  return caseDeadline;
};
