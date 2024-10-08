import { state } from '@web-client/presenter/app.cerebral';

export const submitChangeLoginAndServiceEmailAction = ({
  store,
}: ActionProps) => {
  store.set(state.emailConfirmation.formWasSubmitted, true);
};
