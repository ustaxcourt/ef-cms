import { state } from 'cerebral';

/**
 * appends props.field to state.fieldOrder
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setFieldOrderAction = ({ get, props, store }) => {
  const currentFieldOrder = get(state.fieldOrder) || [];
  currentFieldOrder.push(props.field);
  store.set(state.fieldOrder, currentFieldOrder);
};
