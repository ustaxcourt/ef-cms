import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * compute a case deadline
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.props the cerebral props object
 * @returns {object} the case deadline object
 */
export const getCaseDeadlineFromFormAction = ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  let deadlineDate;

  if (props.computedDate) {
    deadlineDate = applicationContext
      .getUtilities()
      .createISODateString(props.computedDate);
  }

  const { associatedJudge, docketNumber } = get(state.caseDetail);

  const caseDeadline = omit(
    {
      ...get(state.form),
      associatedJudge,
      deadlineDate,
      docketNumber,
    },
    ['day', 'month', 'year', 'searchError'],
  );

  return caseDeadline;
};
