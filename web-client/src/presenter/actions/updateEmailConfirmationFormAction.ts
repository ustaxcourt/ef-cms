import { EmailConfirmationForm } from '@shared/business/entities/EmailConfirmationForm';
import { state } from '@web-client/presenter/app.cerebral';

export const updateEmailConfirmationFormAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const form = get(state.form);
  const formEntity = new EmailConfirmationForm(form);
  const errors = formEntity.getFormattedValidationErrors();

  store.set(state.emailConfirmation.formWasSubmitted, false);

  const { field, inFocus } = get(props);

  if (field === 'email') {
    store.set(state.emailConfirmation.inFocusEmail, inFocus);
    store.set(state.emailConfirmation.isDirtyEmail, true);

    if (errors?.email) {
      store.set(state.emailConfirmation.emailErrorMessage, errors?.email);
    } else {
      store.unset(state.emailConfirmation.emailErrorMessage);
    }
  }

  if (field === 'confirmEmail') {
    store.set(state.emailConfirmation.inFocusConfirmEmail, inFocus);
    store.set(state.emailConfirmation.isDirtyConfirmEmail, true);
  }

  if (errors?.confirmEmail) {
    store.set(
      state.emailConfirmation.confirmEmailErrorMessage,
      errors?.confirmEmail,
    );
  } else {
    store.unset(state.emailConfirmation.confirmEmailErrorMessage);
  }
};
