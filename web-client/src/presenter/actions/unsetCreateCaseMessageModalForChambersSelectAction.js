import { state } from 'cerebral';

/**
 * unsets the modal state when selecting a section other than the chambers section
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props
 * @param {object} providers.store the cerebral store
 * @returns {undefined}
 */
export const unsetCreateCaseMessageModalForChambersSelectAction = ({
  props,
  store,
}) => {
  store.set(state.modal.showChambersSelect, false);
  store.set(state.modal.form.toSection, props.value);
};
