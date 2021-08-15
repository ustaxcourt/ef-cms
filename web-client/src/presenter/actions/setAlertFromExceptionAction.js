import { state } from 'cerebral';

/**
 * sets the state.alertError based on any exceptions that occur in props.error
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext applicationContext
 * @param {object} providers.store the cerebral store used for setting the state.alertError
 * @param {object} providers.props the cerebral props object used for passing the props.error
 */
export const setAlertFromExceptionAction = ({
  applicationContext,
  props,
  store,
}) => {
  const hasError =
    props.error &&
    (props.error.title || props.error.message || props.error.messages);
  const responseCode =
    props.error?.responseCode || props.error?.originalError?.response?.status;

  if (!hasError) {
    store.set(state.alertError, {});
    return;
  }

  applicationContext.getLogger().error(props.error);

  store.set(state.alertError, {
    message: props.error.message,
    responseCode,
    title: props.error.title,
  });
};
