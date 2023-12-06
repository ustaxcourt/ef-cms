import { state } from '@web-client/presenter/app.cerebral';

export const prepareFormAction = ({ store }: ActionProps) => {
  store.set(state.form, { contactPrimary: {} });
};
