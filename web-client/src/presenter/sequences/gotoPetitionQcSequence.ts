import { clearFormsAction } from '../actions/clearFormsAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getConstants } from '../../getConstants';
import { getFeatureFlagFactoryAction } from '../actions/getFeatureFlagFactoryAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseOnFormAction } from '../actions/setCaseOnFormAction';
import { setContactsOnFormAction } from '../actions/setContactsOnFormAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultDocumentSelectedForPreviewAction } from '../actions/setDefaultDocumentSelectedForPreviewAction';
import { setDocumentDetailTabAction } from '../actions/setDocumentDetailTabAction';
import { setDocumentForPreviewSequence } from '../sequences/setDocumentForPreviewSequence';
import { setFeatureFlagFactoryAction } from '../actions/setFeatureFlagFactoryAction';
import { setFormForCaseAction } from '../actions/setFormForCaseAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetDocumentSelectedForPreviewAction } from '../actions/unsetDocumentSelectedForPreviewAction';

export const gotoPetitionQcSequence = startWebSocketConnectionSequenceDecorator(
  [
    setCurrentPageAction('Interstitial'),
    clearFormsAction,
    setRedirectUrlAction,
    stopShowValidationAction,
    setDocumentDetailTabAction,
    getFeatureFlagFactoryAction(
      getConstants().ALLOWLIST_FEATURE_FLAGS
        .E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG.key,
    ),
    setFeatureFlagFactoryAction(
      getConstants().ALLOWLIST_FEATURE_FLAGS
        .E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG.key,
    ),
    getCaseAction,
    setCaseAction,
    setCaseOnFormAction,
    setContactsOnFormAction,
    setFormForCaseAction,
    unsetDocumentSelectedForPreviewAction,
    setDefaultDocumentSelectedForPreviewAction,
    setDocumentForPreviewSequence,
    setCurrentPageAction('PetitionQc'),
  ],
);
