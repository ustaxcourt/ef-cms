import { state } from '@web-client/presenter/app.cerebral';

export const clearPetitionRedactionAcknowledgementAction = ({
  get,
  store,
}: ActionProps) => {
  const file = get(state.form.petitionFile);
  if (!file) {
    store.unset(state.form.petitionRedactionAcknowledgement);
  }
};
