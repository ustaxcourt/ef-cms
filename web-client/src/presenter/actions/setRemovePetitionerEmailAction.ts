import { state } from '@web-client/presenter/app.cerebral';

export const setRemovePetitionerEmailAction = ({
  props,
  store,
}: ActionProps<{ email: string }>) => {
  store.set(state.modal.petitionerEmailToRemove, props.email);
};
