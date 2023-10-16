import { FORMATS } from '@shared/business/utilities/DateHandler';
import { find } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * creates a case deadline
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.props the cerebral props object
 */
export const setCaseDeadlineFormAction = ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps) => {
  const caseDeadlines = get(state.caseDeadlines);

  const caseDeadline = find(caseDeadlines, {
    caseDeadlineId: props.caseDeadlineId,
  });

  let form;

  if (caseDeadline) {
    form = {
      caseDeadlineId: caseDeadline.caseDeadlineId,
      deadlineDate: applicationContext
        .getUtilities()
        .formatDateString(caseDeadline.deadlineDate, FORMATS.YYYYMMDD),
      description: caseDeadline.description,
    };

    store.set(state.form, form);
  }
};
