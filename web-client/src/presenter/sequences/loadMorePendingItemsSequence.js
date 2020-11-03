import { fetchPendingItemsSequence } from '../sequences/pending/fetchPendingItemsSequence';
import { incrementPendingItemsPageAction } from '../actions/PendingItems/incrementPendingItemsPageAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const loadMorePendingItemsSequence = [
  incrementPendingItemsPageAction,
  showProgressSequenceDecorator([...fetchPendingItemsSequence]),
];
