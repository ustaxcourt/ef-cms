import { state } from 'cerebral';

export const prepareFormAction = ({ store }) => {
  store.set(state.form, { contactPrimary: {} });
};
