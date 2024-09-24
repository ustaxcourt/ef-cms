import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const validateCreateTermModalAction = ({ get, path }: ActionProps) => {
  const { termEndDate, termName, termStartDate } = get(state.modal);

  const errors: {
    termEndDate?: string;
    termName?: string;
    termStartDate?: string;
  } = {};

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
