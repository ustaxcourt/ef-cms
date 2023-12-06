import { getConstants } from '../../getConstants';
import { state } from '@web-client/presenter/app.cerebral';
const { ASCENDING } = getConstants();

/**
 * sets the default table sort based on props
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the props passed to the sequence
 * @param {object} providers.store the cerebral store object
 */
export const setInitialTableSortAction = ({ store }: ActionProps) => {
  store.set(state.tableSort.sortField, 'uploadDate');
  store.set(state.tableSort.sortOrder, ASCENDING);
};
