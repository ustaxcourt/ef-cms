import { state } from 'cerebral';

export default ({ store, props, applicationContext }) => {
  store.set(state.user, props.user);
  applicationContext.setCurrentUser(props.user);

  if (process.env.USTC_ENV === 'dev' && props.user) {
    // TODO remove so users can reload page on develop
    window.localStorage.setItem('user', JSON.stringify(props.user));
  }
};
