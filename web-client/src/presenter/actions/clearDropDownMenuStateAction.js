/**
 * Removes prop menuState from store to clear drop down menu
 *
 * @param {object} props the cerebral the cerebral props object
 * @param {object} store the cerebral store object
 */
export const clearDropDownMenuStateAction = ({ props, store }) => {
  store.unset(props.menuState);
};
