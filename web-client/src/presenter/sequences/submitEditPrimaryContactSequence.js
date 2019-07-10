import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';
import { updatePrimaryContactAction } from '../actions/updatePrimaryContactAction';

export const submitEditPrimaryContactSequence = [
  setFormSubmittingAction,
  updatePrimaryContactAction,
  unsetFormSubmittingAction,
  setCurrentPageAction('Interstitial'),
  navigateToCaseDetailAction,
];
