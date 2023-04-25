import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getConstants } from '../../getConstants';
import { getFeatureFlagFactoryAction } from '../actions/getFeatureFlagFactoryAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultFilersMapAction } from '../actions/setDefaultFilersMapAction';
import { setFeatureFlagFactoryAction } from '../actions/setFeatureFlagFactoryAction';
import { setWizardStepAction } from '../actions/setWizardStepAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoFileDocument = startWebSocketConnectionSequenceDecorator([
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  clearScreenMetadataAction,
  setDefaultFilersMapAction,
  getFeatureFlagFactoryAction(
    getConstants().ALLOWLIST_FEATURE_FLAGS.REDACTION_ACKNOWLEDGEMENT_ENABLED
      .key,
  ),
  setFeatureFlagFactoryAction(
    getConstants().ALLOWLIST_FEATURE_FLAGS.REDACTION_ACKNOWLEDGEMENT_ENABLED
      .key,
  ),
  getCaseAction,
  setCaseAction,
  setWizardStepAction('SelectDocumentType'),
  setCurrentPageAction('FileDocumentWizard'),
]);

export const gotoFileDocumentSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoFileDocument,
    unauthorized: [redirectToCognitoAction],
  },
];
