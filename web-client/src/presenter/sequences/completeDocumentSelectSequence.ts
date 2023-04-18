import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearOtherIterationAction } from '../actions/clearOtherIterationAction';
import { defaultSecondaryDocumentAction } from '../actions/FileDocument/defaultSecondaryDocumentAction';
import { formHasSecondaryDocumentAction } from '../actions/FileDocument/formHasSecondaryDocumentAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { getConstants } from '../../getConstants';
import { getFeatureFlagFactoryAction } from '../actions/getFeatureFlagFactoryAction';
import { navigateToFileADocumentAction } from '../actions/FileDocument/navigateToFileADocumentAction';
import { refreshExternalDocumentTitleFromEventCodeAction } from '../actions/FileDocument/refreshExternalDocumentTitleFromEventCodeAction';
import { setComputeFormDateFactoryAction } from '../actions/setComputeFormDateFactoryAction';
import { setDefaultFileDocumentFormValuesAction } from '../actions/FileDocument/setDefaultFileDocumentFormValuesAction';
import { setDocketNumberPropAction } from '../actions/FileDocument/setDocketNumberPropAction';
import { setFeatureFlagFactoryAction } from '../actions/setFeatureFlagFactoryAction';
import { setIsExternalConsolidatedCaseGroupEnabledValueAction } from '../actions/FileDocument/setIsExternalConsolidatedCaseGroupEnabledValueAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateSelectDocumentTypeAction } from '../actions/validateSelectDocumentTypeAction';

export const completeDocumentSelectSequence = [
  startShowValidationAction,
  getComputedFormDateFactoryAction('serviceDate'),
  setComputeFormDateFactoryAction('serviceDate'),
  formHasSecondaryDocumentAction,
  {
    no: [],
    yes: [
      getComputedFormDateFactoryAction('secondaryDocument.serviceDate'),
      setComputeFormDateFactoryAction('secondaryDocument.serviceDate'),
    ],
  },
  defaultSecondaryDocumentAction,
  refreshExternalDocumentTitleFromEventCodeAction,
  generateTitleAction,
  validateSelectDocumentTypeAction,
  {
    error: [setValidationErrorsAction, setValidationAlertErrorsAction],
    success: [
      clearAlertsAction,
      stopShowValidationAction,
      setDocketNumberPropAction,
      getFeatureFlagFactoryAction(
        getConstants().ALLOWLIST_FEATURE_FLAGS
          .CONSOLIDATED_CASES_GROUP_ACCESS_PETITIONER.key,
      ),
      setFeatureFlagFactoryAction(
        getConstants().ALLOWLIST_FEATURE_FLAGS
          .CONSOLIDATED_CASES_GROUP_ACCESS_PETITIONER.key,
      ),
      setIsExternalConsolidatedCaseGroupEnabledValueAction,
      setDefaultFileDocumentFormValuesAction,
      clearOtherIterationAction,
      navigateToFileADocumentAction,
    ],
  },
];
