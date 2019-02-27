import { state } from 'cerebral';

export default ({ store, props, applicationContext }) => {
  store.set(state.token, props.token);
  applicationContext.setCurrentUserToken(props.token);
  window.localStorage.setItem('token', JSON.stringify(props.token));
};
