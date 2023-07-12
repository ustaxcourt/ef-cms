import { state } from 'cerebral';

/**
 * sets the state.docketRecordIndex from props.docketRecordIndex
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setDocketRecordIndexAction = ({ props, store }: ActionProps) => {
  store.set(state.docketRecordIndex, props.docketRecordIndex);
};
