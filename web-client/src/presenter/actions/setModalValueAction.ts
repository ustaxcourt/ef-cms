import { state } from 'cerebral';

/**
 * sets the state.modal to the props.value passed in
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const setModalValueAction = ({ props, store }) => {
  store.set(state.modal[props.key], props.value);
};
