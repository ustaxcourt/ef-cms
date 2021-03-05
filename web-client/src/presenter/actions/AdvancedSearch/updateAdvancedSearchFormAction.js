import { state } from 'cerebral';
/**
 *  returns a callback function that sets isEditingDocketEntry on state
 *
 * @param {string} isEditingDocketEntry the value of isEditingDocketEntry to be set
 * @returns {Function} returns a callback function that sets isEditingDocketEntry on state
 */
export const updateAdvancedSearchFormAction = formName =>
  /**
   * sets the value of state.isEditingDocket entry to the value passed in
   *
   * @param {object} providers the providers object
   * @param {object} providers.store the cerebral store object
   * @param {object} providers.props the cerebral props object
   */
  async ({ props, store }) => {
    const formType = formName || props.formType;
    store.set(state.advancedSearchForm[formType][props.key], props.value);
  };
