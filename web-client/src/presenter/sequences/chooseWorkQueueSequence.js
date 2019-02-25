import { chooseWorkQueueAction } from '../actions/chooseWorkQueueAction';
import { clearWorkQueueAction } from '../actions/clearWorkQueueAction';
import setWorkItems from '../actions/setWorkItemsAction';
import getWorkItemsForSection from '../actions/getWorkItemsForSectionAction';
import getSentWorkItemsForSection from '../actions/getSentWorkItemsForSectionAction';
import getWorkItemsByUser from '../actions/getWorkItemsByUserAction';
import getSentWorkItemsForUser from '../actions/getSentWorkItemsForUserAction';

export default [
  clearWorkQueueAction,
  chooseWorkQueueAction,
  {
    sectioninbox: [getWorkItemsForSection, setWorkItems],
    sectionoutbox: [getSentWorkItemsForSection, setWorkItems],
    myinbox: [getWorkItemsByUser, setWorkItems],
    myoutbox: [getSentWorkItemsForUser, setWorkItems],
  },
];
