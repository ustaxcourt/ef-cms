import { state } from '@web-client/presenter/app.cerebral';
/**
 *  returns a callback function that sets advancedSearchForm on state
 *
 * @param {string} formName the value of formName to be set
 * @returns {Function} returns a callback function that sets advancedSearchForm on state
 */
export const updateAdvancedSearchFormAction =
  (formName?: string) =>
  /**
   * sets the value of state.advancedSearchForm entry to the value passed in
   *
   * @param {object} providers the providers object
   * @param {object} providers.store the cerebral store object
   * @param {object} providers.props the cerebral props object
   */
  ({ props, store }: ActionProps) => {
    const formType = formName || props.formType;
    if (props.value) {
      store.set(state.advancedSearchForm[formType][props.key], props.value);
    } else {
      store.unset(state.advancedSearchForm[formType][props.key]);
    }
  };
