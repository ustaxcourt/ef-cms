import { state } from '@web-client/presenter/app.cerebral';

/**
 * set the user contact update progress state to an empty object
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const unsetUserContactEditProgressAction = ({ store }: ActionProps) => {
  store.set(state.userContactEditProgress, {});
};
