import { state } from 'cerebral';

/**
 * fixme
 *
 */
export const setHealthCheckAction = async ({ props, store }) => {
  store.set(state.health, props.health);
};
