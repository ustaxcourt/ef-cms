import { state } from '@web-client/presenter/app.cerebral';

export const clearPetitionFormAction = ({ store }: ActionProps) => {
  store.set(state.form.petitionFacts, ['']);
  store.unset(state.form.petitionFile);
  store.unset(state.form.petitionFileSize);
  store.set(state.form.petitionReasons, ['']);
  store.unset(state.form.petitionRedactionAcknowledgement);
  store.unset(state.form.petitionType);
};
