import { state } from '@web-client/presenter/app.cerebral';
import { STATE_KEYS } from '@shared/business/entities/EntityConstants';
import { GenerateSuggestedTermForm } from '@shared/business/entities/trialSessions/GenerateSuggestedTermForm';

export const validateCreateTermFormAction = ({ get, path }: ActionProps) => {
  const TERM_BUILDER_INFORMATION = get(
    state[STATE_KEYS.TERM_BUILDER_INFORMATION],
  );

  const errors = new GenerateSuggestedTermForm(
    TERM_BUILDER_INFORMATION,
  ).getFormattedValidationErrors();

  console.log('errors', errors);

  //TODO: determine how validation errors are displayed
  return path.success();
};
