import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the statistic index from props
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 * @returns {void}
 */
export const setStatisticIndexAction = ({ props, store }: ActionProps) => {
  const { key, statisticIndex, subkey } = props;

  // this is a null check (since when statisticIndex = 0 it is still falsy)
  if (typeof statisticIndex === 'number') {
    store.set(state.modal.statisticIndex, statisticIndex);
  }
  store.set(state.modal.key, key);
  store.set(state.modal.subkey, subkey);
};
