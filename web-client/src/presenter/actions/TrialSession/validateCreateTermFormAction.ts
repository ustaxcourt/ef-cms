import { state } from '@web-client/presenter/app.cerebral';
import {
  STATE_KEYS,
  SUGGESTED_TRIAL_SESSION_TITLES,
  USER_MESSAGE_TYPES,
} from '@shared/business/entities/EntityConstants';
import { GenerateSuggestedTermForm } from '@shared/business/entities/trialSessions/GenerateSuggestedTermForm';

export const validateCreateTermFormAction = ({ get, path }: ActionProps) => {
  const TERM_BUILDER_INFORMATION = get(
    state[STATE_KEYS.TERM_BUILDER_INFORMATION],
  );

  const TERM_BUILDER_ERRORS = new GenerateSuggestedTermForm(
    TERM_BUILDER_INFORMATION,
  ).getFormattedValidationErrors();

  if (TERM_BUILDER_ERRORS)
    return path.error({
      alertError: {
        scrollToErrorNotification: true,
        messages: Object.values(TERM_BUILDER_ERRORS),
        title: SUGGESTED_TRIAL_SESSION_TITLES.validation,
        type: USER_MESSAGE_TYPES.error,
      },
    });

  return path.success();
};
