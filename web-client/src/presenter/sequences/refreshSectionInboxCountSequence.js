import { getWorkItemsForSectionAction } from '../actions/getWorkItemsForSectionAction';
import { setSectionInboxCountAction } from '../actions/setSectionInboxCountAction';
import { setWorkItemsAction } from '../actions/setWorkItemsAction';

export const refreshSectionInboxCountSequence = [
  getWorkItemsForSectionAction,
  setWorkItemsAction,
  setSectionInboxCountAction,
];
