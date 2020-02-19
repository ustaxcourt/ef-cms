import { state } from 'cerebral';

/**
 * updates form with the case detail
 *
 */
export const updateFormWithCaseDetailAction = ({ get, props, store }) => {
  store.set(state.form, {
    ...get(state.form),
    ...props.combinedCaseDetailWithForm,
  });
};
