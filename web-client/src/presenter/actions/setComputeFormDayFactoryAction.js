import { state } from 'cerebral';

/**
 * factory action for setting state.form.day to state.form[key]
 *
 * @param {string} key the key for state.form[key]
 * @returns {Function} the primed action
 */
export const setComputeFormDayFactoryAction = key => {
  /**
   * sets state.form.day to whatever state.form[key] is set to
   *
   * @param {object} providers the providers object
   * @param {object} providers.get the cerebral get function
   * @param {object} providers.store the cerebral store
   */
  const setComputeFormDayAction = ({ get, store }) => {
    const dayValue = get(state.form[key]);
    store.set(state.form.day, dayValue);
  };

  return setComputeFormDayAction;
};
