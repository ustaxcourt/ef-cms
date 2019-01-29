import { state } from 'cerebral';

export default ({ props, store }) => {
  const hasError = props.error && (props.error.title || props.error.message);
  if (!hasError) {
    return;
  }
  store.set(state.alertError, {
    title: props.error.title,
    message: props.error.message,
  });
};
