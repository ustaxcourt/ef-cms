import { state } from 'cerebral';

export default ({ props, store }) => {
  store.set(state.alertError, {
    title: props.error.title,
    message: props.error.message,
  });
};
