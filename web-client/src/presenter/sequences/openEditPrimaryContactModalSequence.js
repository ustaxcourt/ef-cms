import { clearFormAction } from '../actions/clearFormAction';
import { openEditPrimaryContactModalAction } from '../actions/openEditPrimaryContactModalAction';
import { prepareFormAction } from '../actions/prepareFormAction';
import { setContactPrimaryToEditAction } from '../actions/setContactPrimaryToEditAction';

export const openEditPrimaryContactModalSequence = [
  clearFormAction,
  prepareFormAction,
  setContactPrimaryToEditAction,
  openEditPrimaryContactModalAction,
];
