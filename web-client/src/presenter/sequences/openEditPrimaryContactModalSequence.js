import { clearFormAction } from '../actions/clearFormAction';
import { openEditPrimaryContactModalAction } from '../actions/openEditPrimaryContactModalAction';
import { prepareFormAction } from '../actions/prepareFormAction';

export const openEditPrimaryContactModalSequence = [
  clearFormAction,
  prepareFormAction,
  openEditPrimaryContactModalAction,
];
