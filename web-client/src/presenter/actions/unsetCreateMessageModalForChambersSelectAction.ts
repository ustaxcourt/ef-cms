import { state } from '@web-client/presenter/app.cerebral';

/**
 * unsets the modal state when selecting a section other than the chambers section
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props
 * @param {object} providers.store the cerebral store
 * @returns {undefined}
 */
export const unsetCreateMessageModalForChambersSelectAction = ({
  props,
  store,
}: ActionProps) => {
  store.set(state.modal.showChambersSelect, false);
  store.set(state.modal.form.toSection, props.value);
};
