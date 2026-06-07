import { state } from '@web-client/presenter/app.cerebral';

export const unsetRedirectUrlAction = ({ store }) => {
  store.unset(state.redirectUrl);
};
