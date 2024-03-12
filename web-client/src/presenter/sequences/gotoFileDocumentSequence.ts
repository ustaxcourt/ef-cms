import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDefaultFilersMapAction } from '../actions/setDefaultFilersMapAction';
import { setWizardStepAction } from '../actions/setWizardStepAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoFileDocumentSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    stopShowValidationAction,
    clearFormAction,
    clearScreenMetadataAction,
    setDefaultFilersMapAction,
    getCaseAction,
    setCaseAction,
    setWizardStepAction('SelectDocumentType'),
    setupCurrentPageAction('FileDocumentWizard'),
  ]);
