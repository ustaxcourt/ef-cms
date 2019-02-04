import clearWorkQueue from '../actions/clearWorkQueueAction';
import setWorkItems from '../actions/setWorkItemsAction';
import switchWorkQueue from '../actions/switchWorkQueueAction';
import getWorkItemsForSection from '../actions/getWorkItemsForSectionAction';
import getSentWorkItemsForSection from '../actions/getSentWorkItemsForSectionAction';
import getWorkItemsByUser from '../actions/getWorkItemsByUserAction';
import getSentWorkItemsForUser from '../actions/getSentWorkItemsForUserAction';

export default [
  clearWorkQueue,
  switchWorkQueue,
  {
    sectioninbox: [getWorkItemsForSection],
    sectionoutbox: [getSentWorkItemsForSection],
    myinbox: [getWorkItemsByUser],
    myoutbox: [getSentWorkItemsForUser],
  },
  setWorkItems,
];
