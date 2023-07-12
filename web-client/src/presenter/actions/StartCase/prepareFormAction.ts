import { state } from 'cerebral';

export const prepareFormAction = ({ store }: ActionProps) => {
  store.set(state.form, { contactPrimary: {} });
};
