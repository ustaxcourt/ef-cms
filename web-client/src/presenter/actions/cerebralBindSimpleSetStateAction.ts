import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.props.key to the value of props.value
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.key and props.value
 * @param {object} providers.store the cerebral store used for setting the state.props.key
 */
export const cerebralBindSimpleSetStateAction = ({
  props,
  store,
}: ActionProps) => {
  store.set(state[props.key], props.value);
};
