import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { parallel } from 'cerebral/factories';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocumentDetailTabAction } from '../actions/setDocumentDetailTabAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';
import { updatePrimaryContactAction } from '../actions/updatePrimaryContactAction';

export const submitEditPrimaryContactSequence = [
  setFormSubmittingAction,
  updatePrimaryContactAction,
  parallel([[setDocumentDetailTabAction, setAlertSuccessAction]]),
  unsetFormSubmittingAction,
  setCurrentPageAction('Interstitial'),
  navigateToCaseDetailAction,
];
