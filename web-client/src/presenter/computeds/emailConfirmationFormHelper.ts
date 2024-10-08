import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const emailConfirmationFormHelper = (get: Get): any => {
  const {
    confirmEmailErrorMessage,
    emailErrorMessage,
    formWasSubmitted,
    inFocusConfirmEmail,
    inFocusEmail,
    isDirtyConfirmEmail,
    isDirtyEmail,
  } = get(state.emailConfirmation);

  const confirmEmailChangedSinceSubmission =
    !formWasSubmitted && isDirtyConfirmEmail;

  const emailChangedSinceSubmission = !formWasSubmitted && isDirtyEmail;

  const showConfirmEmailErrorMessage =
    formWasSubmitted ||
    (confirmEmailChangedSinceSubmission && !inFocusConfirmEmail);
  const showEmailErrorMessage =
    formWasSubmitted || (emailChangedSinceSubmission && !inFocusEmail);

  return {
    confirmEmailErrorMessage,
    emailErrorMessage,
    showConfirmEmailErrorMessage,
    showEmailErrorMessage,
  };
};
