import { fetchPendingItemsSequence } from './Pending/fetchPendingItemsSequence';
import { incrementPendingItemsPageAction } from '../actions/PendingItems/incrementPendingItemsPageAction';

export const loadMorePendingItemsSequence = [
  incrementPendingItemsPageAction,
  ...fetchPendingItemsSequence,
];
