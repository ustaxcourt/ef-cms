import { state } from 'cerebral';

export default ({ store, props, applicationContext }) => {
  store.set(state.user, props.user);
  applicationContext.setCurrentUser(props.user);

  if (process.env.USTC_ENV === 'dev' && props.user) {
    window.localStorage.setItem('user', JSON.stringify(props.user));
  }
};
