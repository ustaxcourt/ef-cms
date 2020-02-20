import { state } from 'cerebral';

/**
 * updates form with the case detail
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the passed in props
 * @param {object} providers.store the cerebral store function
 *
 */
export const updateFormWithCaseDetailAction = ({ get, props, store }) => {
  store.set(state.form, {
    ...get(state.form),
    ...props.combinedCaseDetailWithForm,
  });
};
