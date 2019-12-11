import { state } from 'cerebral';

/**
 * sets modal error state
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props
 * @param {object} providers.store the cerebral store
 * @returns {void}
 */
export const setModalErrorAction = ({ props, store }) => {
  const { error } = props;

  store.set(state.modal.error, error);
};
