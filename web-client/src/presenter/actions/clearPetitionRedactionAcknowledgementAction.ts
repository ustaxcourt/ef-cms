import { state } from '@web-client/presenter/app.cerebral';

export const clearPetitionRedactionAcknowledgementAction = ({
  store,
}: ActionProps) => {
  store.unset(state.form.petitionRedactionAcknowledgement);
};
