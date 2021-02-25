/**
 * Toggles visibility of expanded menu in header
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function to retrieve state values
 * @param {object} providers.store the cerebral store object used for setting or unsetting open menu
 */
export const toggleMenuStateAction = ({ props, store }) => {
  store.toggle(props.menuState);
};
