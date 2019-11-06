import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const fetchPendingItemsSequence = [set(state.pendingItems, [])];
