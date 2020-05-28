import { state } from 'cerebral';

/**
 * clears the form values if the yearOrPeriod value changes
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const clearAddDeficiencyFormValuesAction = ({ props, store }) => {
  if (props.key.includes('yearOrPeriod')) {
    store.set(state.form, {
      yearOrPeriod: props.value,
    });
  }
};
