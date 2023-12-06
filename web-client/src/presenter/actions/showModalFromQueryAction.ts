import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.modal.showModal based on the props.openModal passed in (mainly used for pa11y and debugging)
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const showModalFromQueryAction = ({ props, store }: ActionProps) => {
  props.openModal && store.set(state.modal.showModal, props.openModal);
};
