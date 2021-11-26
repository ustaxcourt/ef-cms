import { state } from 'cerebral';

/**
 * receives a broadcasted refresh token and saves it to state
 *
 * @param {object} providers the providers object
 * @param {object} providers.props contains the refresh token to be saved
 * @param {object} providers.store allows us to set the value in state
 */
export const receiveRefreshTokenAction = ({ props, store }) => {
  if (!process.env.IS_LOCAL) {
    store.set(state.refreshToken, props.refreshToken);
  }
};
