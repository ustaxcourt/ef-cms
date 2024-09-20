import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.modal to the props.value passed in
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const setModalValueAction = ({ props, store }: ActionProps) => {
  console.log('key', props.key);
  console.log('value', props.value);
  store.set(state.modal[props.key], props.value);
};
