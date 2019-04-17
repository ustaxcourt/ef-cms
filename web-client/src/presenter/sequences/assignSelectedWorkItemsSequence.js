import { assignSelectedWorkItemsAction } from '../actions/assignSelectedWorkItemsAction';
import { getWorkItemsForSectionAction } from '../actions/getWorkItemsForSectionAction';
import { setWorkItemsAction } from '../actions/setWorkItemsAction';

import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';

export const assignSelectedWorkItemsSequence = [
  setFormSubmittingAction,
  assignSelectedWorkItemsAction,
  getWorkItemsForSectionAction,
  setWorkItemsAction,
  unsetFormSubmittingAction,
];
