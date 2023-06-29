import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the token on the state
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.user
 * @param {object} providers.props the cerebral props object used for getting the props.user
 * @param {object} providers.applicationContext the application context needed for getting the setCurrentUser method
 */
export const setTokenAction = ({
  applicationContext,
  props,
  store,
}: ActionProps) => {
  store.set(state.token, props.token);
  store.set(state.refreshToken, props.refreshToken || null);
  applicationContext.setCurrentUserToken(props.token);
};
