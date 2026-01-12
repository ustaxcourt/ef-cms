import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import { GenerateSuggestedTermModal } from '@shared/business/entities/trialSessions/GenerateSuggestedTermModal';

export const validateCreateTermModalAction = ({ get, path }: ActionProps) => {
  const TERM_BUILDER_INFORMATION = get(state.modal);

  const errors = new GenerateSuggestedTermModal(
    TERM_BUILDER_INFORMATION,
  ).getFormattedValidationErrors();

  if (isEmpty(errors)) {
    return path.success();
  } else {
    return path.error({ errors });
  }
};
