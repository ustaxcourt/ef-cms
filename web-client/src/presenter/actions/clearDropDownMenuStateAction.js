/**
 * clears out the drop down menu state
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCase use case
 * @param {object} providers.props the cerebral the cerebral props object
 * @param {object} providers.store the cerebral store object
 * @returns {object} contains the caseDetail returned from the use case
 */
export const clearDropDownMenuStateAction = async ({ props, store }) => {
  store.unset(props.menuState);
};
