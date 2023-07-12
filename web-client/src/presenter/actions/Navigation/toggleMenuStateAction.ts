/**
 * Toggles visibility of expanded menu in DropdownMenu
 *
 * @param {object} get the cerebral get function to retrieve state values
 * @param {object} store the cerebral store object used for setting or unsetting open menu
 */
export const toggleMenuStateAction = ({ props, store }: ActionProps) => {
  store.toggle(props.menuState);
};
