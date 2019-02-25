import { assignSelectedWorkItemsAction } from '../actions/assignSelectedWorkItemsAction';
import getWorkItemsForSection from '../actions/getWorkItemsForSectionAction';
import setWorkItems from '../actions/setWorkItemsAction';

export const assignSelectedWorkItemsSequence = [
  assignSelectedWorkItemsAction,
  getWorkItemsForSection,
  setWorkItems,
];
