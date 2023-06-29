import { state } from '@web-client/presenter/app.cerebral';

/**
 * Toggles visibility of expanded menu in header
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function to retrieve state values
 * @param {object} providers.store the cerebral store object used for setting or unsetting open menu
 */
export const toggleMenuAction = ({ get, props, store }: ActionProps) => {
  const openMenu = get(state.navigation.openMenu);
  if (openMenu === props.openMenu) {
    store.unset(state.navigation.openMenu);
  } else {
    store.set(state.navigation.openMenu, props.openMenu);
  }

  const caseDetailMenu = get(state.navigation.caseDetailMenu);
  if (caseDetailMenu === props.caseDetailMenu) {
    store.unset(state.navigation.caseDetailMenu);
  } else {
    store.set(state.navigation.caseDetailMenu, props.caseDetailMenu);
  }
};
