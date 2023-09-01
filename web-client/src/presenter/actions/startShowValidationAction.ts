import { state } from '@web-client/presenter/app.cerebral';

export const startShowValidationAction = ({ store }: ActionProps) => {
  store.set(state.showValidation, true);
};
