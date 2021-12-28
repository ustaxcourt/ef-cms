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
  async ({ applicationContext, get, props, store }) => {
    const formType = formName || props.formType;
    if (props.value) {
      store.set(state.advancedSearchForm[formType][props.key], props.value);

      await applicationContext
        .getUseCases()
        .setItemInteractor(applicationContext, {
          key: 'advancedSearchTab',
          value: get(state.advancedSearchTab) || 'case',
        });
      await applicationContext
        .getUseCases()
        .setItemInteractor(applicationContext, {
          key: 'advancedSearchForm',
          value: get(state.advancedSearchForm),
        });
    } else {
      store.unset(state.advancedSearchForm[formType][props.key]);
    }
  };
