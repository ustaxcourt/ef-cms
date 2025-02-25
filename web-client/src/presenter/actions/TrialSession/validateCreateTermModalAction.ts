import { GenerateSuggestedTermForm } from '@shared/business/entities/trialSessions/GenerateSuggestedTermForm';
import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const validateCreateTermModalAction = ({ get, path }: ActionProps) => {
  const { termEndDate, termName, termStartDate } = get(state.modal);

  const errors = new GenerateSuggestedTermForm({
    termEndDate,
    termName,
    termStartDate,
  }).getFormattedValidationErrors();

  if (isEmpty(errors)) {
    return path.success();
  } else {
    return path.error({ errors });
  }
};
