import { state } from 'cerebral';

/**
 * set the modal state error from props
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const setCanConsolidateErrorAction = ({ props, store }) => {
  const { error } = props;

  store.set(state.modal.error, error);
};
