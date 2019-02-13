import { state } from 'cerebral';

export default ({ store, props }) => {
  store.set(state.token, props.token);
  if (process.env.USTC_ENV === 'dev' && props.user) {
    //TODO remove if statement so users can reload pages on develop
    window.localStorage.setItem('token', JSON.stringify(props.token));
  }
};
