import { state } from 'cerebral';

export default ({ props, store }) => {
  if (!props.error) {
    return;
  }
  store.set(state.alertError, {
    title: props.error.title,
    message: props.error.message,
  });
};
