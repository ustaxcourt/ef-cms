import { state } from '@web-client/presenter/app.cerebral';

export const unsetCreateOrderSelectedCases = ({ store }: ActionProps) => {
  store.unset(state.createOrderSelectedCases);
};
