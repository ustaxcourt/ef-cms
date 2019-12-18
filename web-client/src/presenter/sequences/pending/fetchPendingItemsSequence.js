import { fetchPendingItemsAction } from '../../actions/PendingItems/fetchPendingItemsAction';
import { setPendingItemsAction } from '../../actions/PendingItems/setPendingItemsAction';

export const fetchPendingItemsSequence = [
  fetchPendingItemsAction,
  setPendingItemsAction,
];
