import { state } from '../app.cerebral';

export const setDefaultPaperServiceAcknowledgementAction = ({
  store,
}: ActionProps) => {
  store.set(state.form.paperServiceAcknowledgement, false);
};
