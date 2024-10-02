import { GenerateSuggestedTermForm } from '@shared/business/entities/trialSessions/GeneratedSuggestedTermForm';
import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const validateCreateTermModalAction = ({ get, path }: ActionProps) => {
  // TODO: reconsider this?
  const {
    termEndDate = '',
    termName = '',
    termStartDate = '',
  } = get(state.modal);

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
