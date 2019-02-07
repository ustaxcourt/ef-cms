import { state } from 'cerebral';

export default ({ props, store }) => {
  const hasError =
    props.error &&
    (props.error.title || props.error.message || props.error.messages);
  if (!hasError) {
    store.set(state.alertError, {});
    return;
  }
  store.set(state.alertError, {
    title: props.error.title,
    message: props.error.message,
  });
};
