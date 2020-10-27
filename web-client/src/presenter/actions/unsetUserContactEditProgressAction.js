import { state } from 'cerebral';

/**
 * set the user contact update progress state to an empty object
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const unsetUserContactEditProgressAction = ({ store }) => {
  store.set(state.userContactEditProgress, {});
};
