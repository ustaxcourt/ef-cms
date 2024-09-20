import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const validateCreateTermModalAction = ({
  // applicationContext,
  get,
  path,
}: ActionProps) => {
  const { term, termEndDate, termName, termStartDate } = get(state.modal);
  // const { STATUS_TYPES_WITH_ASSOCIATED_JUDGE } =
  //   applicationContext.getConstants();

  const errors: {
    term?: string;
    termEndDate?: string;
    termName?: string;
    termStartDate?: string;
  } = {};

  if (!term) {
    console.log(term);
    errors.term = 'Select a term';
  }
  if (!termName) {
    errors.termName = 'Enter a term name';
  }
  if (!termEndDate) {
    errors.termEndDate = 'Enter a term end date';
  }
  if (!termStartDate) {
    errors.termStartDate = 'Enter a term start date';
  }

  if (isEmpty(errors)) {
    return path.success();
  } else {
    return path.error({ errors });
  }
};
