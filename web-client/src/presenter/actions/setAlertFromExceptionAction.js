import { state } from 'cerebral';

/**
 * sets the state.alertError based on any exceptions that occur in props.error
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store used for setting the state.alertError
 * @param {Object} providers.props the cerebral props object used for passing the props.error
 */
export const setAlertFromExceptionAction = ({ props, store }) => {
  const hasError =
    props.error &&
    (props.error.title || props.error.message || props.error.messages);
  if (!hasError) {
    store.set(state.alertError, {});
    return;
  }
  store.set(state.alertError, {
    message: props.error.message,
    title: props.error.title,
  });
};
