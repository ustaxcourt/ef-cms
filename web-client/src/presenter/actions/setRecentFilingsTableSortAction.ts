import { state } from '@web-client/presenter/app.cerebral';

const setRecentFilingsTableSort = (
  store: ActionProps['store'],
  sortField: string,
  sortOrder: string,
) => {
  store.set(state.recentFilingsTableSort.sortField, sortField);
  store.set(state.recentFilingsTableSort.sortOrder, sortOrder);
};

/**
 * sets the sorting parameters for the recent filings table
 * @param {object} providers the providers object
 * @param {object} providers.props the props containing sortField and sortOrder
 * @param {object} providers.store the cerebral store object
 * @returns {void}
 */
export const setRecentFilingsTableSortAction = ({
  props,
  store,
}: ActionProps) => {
  setRecentFilingsTableSort(store, props.sortField, props.sortOrder);
};

/**
 * sets default sorting parameters for the recent filings table
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @returns {void}
 */
export const setDefaultRecentFilingsTableSortAction = ({
  store,
}: ActionProps) => {
  setRecentFilingsTableSort(store, 'filedDate', 'desc');
};
