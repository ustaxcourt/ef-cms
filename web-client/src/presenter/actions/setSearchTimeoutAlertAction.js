import { state } from 'cerebral';

/**
 * sets the state.alertError based on any exceptions that occur in props.error
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext applicationContext
 * @param {object} providers.store the cerebral store used for setting the state.alertError
 * @param {object} providers.props the cerebral props object used for passing the props.error
 */
export const setSearchTimeoutAlertAction = ({
  applicationContext,
  props,
  store,
}) => {
  const responseCode =
    props.error?.responseCode || props.error?.originalError?.response?.status;

  applicationContext.getLogger().error(props.error);

  store.set(state.alertError, {
    message:
      'Please wait a few moments, then click the Search button to retry.',
    responseCode,
    title: 'Search is taking too long to respond',
  });
};
