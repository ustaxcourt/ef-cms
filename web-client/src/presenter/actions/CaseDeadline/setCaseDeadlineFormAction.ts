import { FORMATS } from '@shared/business/utilities/DateHandler';
import { find } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const setCaseDeadlineFormAction = ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps<{ caseDeadlineId: string }>) => {
  const caseDeadlines = get(state.caseDeadlines);

  const caseDeadline = find(caseDeadlines, {
    caseDeadlineId: props.caseDeadlineId,
  });

  if (caseDeadline) {
    const form = {
      caseDeadlineId: caseDeadline.caseDeadlineId,
      deadlineDate: caseDeadline.deadlineDate,
      deadlineDateFormatted: applicationContext
        .getUtilities()
        .formatDateString(caseDeadline.deadlineDate, FORMATS.MMDDYY),
      description: caseDeadline.description,
    };

    store.set(state.form, form);
  }
};
