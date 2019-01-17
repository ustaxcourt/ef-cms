import assignSelectedWorkItemsAction from '../actions/assignSelectedWorkItemsAction';
import getWorkItemsByUser from '../actions/getWorkItemsByUserAction';
import getWorkItemsForSection from '../actions/getWorkItemsForSectionAction';
import setSectionWorkQueue from '../actions/setSectionWorkQueueAction';
import setWorkItems from '../actions/setWorkItemsAction';

export default [
  assignSelectedWorkItemsAction,
  getWorkItemsForSection('docket'), // TODO: this needs to change based on the user role / section
  setSectionWorkQueue,
  getWorkItemsByUser,
  setWorkItems,
];
