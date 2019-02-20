import clearWorkQueue from '../actions/clearWorkQueueAction';
import setWorkItems from '../actions/setWorkItemsAction';
import chooseWorkQueue from '../actions/chooseWorkQueueAction';
import getWorkItemsForSection from '../actions/getWorkItemsForSectionAction';
import getSentWorkItemsForSection from '../actions/getSentWorkItemsForSectionAction';
import getWorkItemsByUser from '../actions/getWorkItemsByUserAction';
import getSentWorkItemsForUser from '../actions/getSentWorkItemsForUserAction';

export default [
  clearWorkQueue,
  chooseWorkQueue,
  {
    sectioninbox: [getWorkItemsForSection, setWorkItems],
    sectionoutbox: [getSentWorkItemsForSection, setWorkItems],
    myinbox: [getWorkItemsByUser, setWorkItems],
    myoutbox: [getSentWorkItemsForUser, setWorkItems],
  },
];
