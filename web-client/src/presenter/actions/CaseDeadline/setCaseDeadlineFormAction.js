import { find } from 'lodash';
import { parseDateToMonthDayYear } from './parseDateToMonthDayYear';
import { state } from 'cerebral';

/**
 * creates a case deadline
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.props the cerebral props object
 * @returns {Promise<*>} the promise of the completed action
 */
export const setCaseDeadlineFormAction = async ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const caseDetail = get(state.caseDetail);
  const caseDeadline = find(caseDetail.caseDeadlines, {
    caseDeadlineId: props.caseDeadlineId,
  });

  let form;

  if (caseDeadline) {
    form = {
      ...parseDateToMonthDayYear({
        applicationContext,
        dateString: caseDeadline.deadlineDate,
      }),
      caseDeadlineId: caseDeadline.caseDeadlineId,
      description: caseDeadline.description,
    };

    store.set(state.form, form);
  }
};
