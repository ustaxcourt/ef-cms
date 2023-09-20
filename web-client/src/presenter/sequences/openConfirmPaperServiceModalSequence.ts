import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { generateTitleForPaperFilingAction } from '../actions/FileDocument/generateTitleForPaperFilingAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { getConsolidatedCasesByCaseAction } from '../actions/CaseConsolidation/getConsolidatedCasesByCaseAction';
import { getConstants } from '../../getConstants';
import { isDocketEntryMultiDocketableAction } from '../actions/CaseConsolidation/isDocketEntryMultiDocketableAction';
import { isFeatureFlagEnabledFactoryAction } from '../actions/isFeatureFlagEnabledFactoryAction';
import { setComputeFormDateFactoryAction } from '../actions/setComputeFormDateFactoryAction';
import { setConsolidatedCasesForCaseAction } from '../actions/CaseConsolidation/setConsolidatedCasesForCaseAction';
import { setDocumentIsRequiredAction } from '../actions/DocketEntry/setDocumentIsRequiredAction';
import { setFilersFromFilersMapAction } from '../actions/setFilersFromFilersMapAction';
import { setMultiDocketingCheckboxesAction } from '../actions/CaseConsolidation/setMultiDocketingCheckboxesAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { suggestSaveForLaterValidationAction } from '../actions/DocketEntry/suggestSaveForLaterValidationAction';
import { validateDocketEntryAction } from '../actions/DocketEntry/validateDocketEntryAction';

const multiDocketablePaperFilings =
  getConstants().ALLOWLIST_FEATURE_FLAGS.MULTI_DOCKETABLE_PAPER_FILINGS;

export const openConfirmPaperServiceModalSequence = [
  clearAlertsAction,
  clearModalStateAction,
  startShowValidationAction,
  getComputedFormDateFactoryAction('serviceDate'),
  setComputeFormDateFactoryAction('serviceDate'),
  isDocketEntryMultiDocketableAction,
  {
    no: [],
    yes: [
      isFeatureFlagEnabledFactoryAction(multiDocketablePaperFilings),
      {
        no: [],
        yes: [
          getConsolidatedCasesByCaseAction,
          setConsolidatedCasesForCaseAction,
          setMultiDocketingCheckboxesAction,
        ],
      },
    ],
  },
  setDocumentIsRequiredAction,
  generateTitleForPaperFilingAction,
  setFilersFromFilersMapAction,
  validateDocketEntryAction,
  {
    error: [
      suggestSaveForLaterValidationAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      setShowModalFactoryAction('ConfirmInitiatePaperFilingServiceModal'),
    ],
  },
];
