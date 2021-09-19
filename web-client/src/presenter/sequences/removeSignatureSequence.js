import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { removeSignatureAction } from '../actions/removeSignatureAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setPropsForRemoveSignatureAction } from '../actions/setPropsForRemoveSignatureAction';
import { setViewerDraftDocumentToDisplayAction } from '../actions/setViewerDraftDocumentToDisplayAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const removeSignatureSequence = showProgressSequenceDecorator([
  clearAlertsAction,
  setPropsForRemoveSignatureAction,
  removeSignatureAction,
  setAlertSuccessAction,
  clearModalAction,
  clearModalStateAction,
  setCaseAction,
  setViewerDraftDocumentToDisplayAction,
]);
