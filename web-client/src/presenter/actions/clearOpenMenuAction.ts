import { state } from '@web-client/presenter/app.cerebral';

/**
 * resets the state.navigation.openMenu
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 */
export const clearOpenMenuAction = ({ store }: ActionProps) => {
  store.unset(state.navigation.openMenu);
};
