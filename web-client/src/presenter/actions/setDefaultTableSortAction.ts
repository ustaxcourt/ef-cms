import { getConstants } from '../../getConstants';
import { state } from '@web-client/presenter/app.cerebral';
const { ASCENDING, DESCENDING } = getConstants();
import { User } from '@shared/business/entities/User';

/**
 * sets the default sort based on the section picked.
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the props passed to the sequence
 * @param {object} providers.store the cerebral store object
 */
export const setDefaultTableSortAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const userRole = get(state.user.role);

  if (!User.isInternalUser(userRole)) {
    store.unset(state.tableSort);
    return;
  }

  // different tables require different default sorting
  if (props.box === 'inbox') {
    store.set(state.tableSort.sortField, 'createdAt');
    store.set(state.tableSort.sortOrder, ASCENDING);
  } else if (props.box === 'outbox') {
    store.set(state.tableSort.sortField, 'createdAt');
    store.set(state.tableSort.sortOrder, DESCENDING);
  } else if (props.box === 'completed') {
    store.set(state.tableSort.sortField, 'completedAt');
    store.set(state.tableSort.sortOrder, DESCENDING);
  }
};
