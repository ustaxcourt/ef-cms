import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const fetchPendingItemsSequence = [
  getPendingItemsAction,
  setPendingItemsAction,
];
