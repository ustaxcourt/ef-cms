import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the modal title
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 * @returns {void}
 */
export const setModalTitleAction = ({ props, store }: ActionProps) => {
  store.set(state.modal.title, props.title);
};
