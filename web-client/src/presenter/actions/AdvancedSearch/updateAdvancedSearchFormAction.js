import { state } from 'cerebral';
/**
 *  returns a callback function that sets advancedSearchForm on state
 *
 * @param {string} formName the value of formName to be set
 * @returns {Function} returns a callback function that sets advancedSearchForm on state
 */
export const updateAdvancedSearchFormAction =
  formName =>
  /**
   * sets the value of state.advancedSearchForm entry to the value passed in
   *
   * @param {object} providers the providers object
   * @param {object} providers.store the cerebral store object
   * @param {object} providers.props the cerebral props object
   */
  ({ props, store }) => {
    const formType = formName || props.formType;
    store.set(state.advancedSearchForm[formType][props.key], props.value);
  };
