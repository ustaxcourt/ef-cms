import { state } from 'cerebral';

export const setTokenAction = ({ store, props, applicationContext }) => {
  store.set(state.token, props.token);
  store.set(state.refreshToken, props.refreshToken);
  applicationContext.setCurrentUserToken(props.token);
  window.localStorage.setItem('token', JSON.stringify(props.token));
};
