import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { generateTitleForPaperFilingAction } from '../actions/FileDocument/generateTitleForPaperFilingAction';
import { isDocketEntryMultiDocketableAction } from '../actions/CaseConsolidation/isDocketEntryMultiDocketableAction';
import { setDocumentIsRequiredAction } from '../actions/DocketEntry/setDocumentIsRequiredAction';
import { setFilersFromFilersMapAction } from '../actions/setFilersFromFilersMapAction';
import { setMultiDocketingCheckboxesAction } from '../actions/CaseConsolidation/setMultiDocketingCheckboxesAction';
import { setScrollToErrorNotificationAction } from '@web-client/presenter/actions/setScrollToErrorNotificationAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '@web-client/presenter/actions/startShowValidationAction';
import { suggestSaveForLaterValidationAction } from '../actions/DocketEntry/suggestSaveForLaterValidationAction';
import { validateDocketEntryAction } from '../actions/DocketEntry/validateDocketEntryAction';

export const openConfirmPaperServiceModalSequence = [
  clearAlertsAction,
  clearModalStateAction,
  setDocumentIsRequiredAction,
  startShowValidationAction,
  generateTitleForPaperFilingAction,
  setFilersFromFilersMapAction,
  validateDocketEntryAction,
  {
    error: [
      suggestSaveForLaterValidationAction,
      setValidationErrorsAction,
      setScrollToErrorNotificationAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      isDocketEntryMultiDocketableAction,
      {
        no: [],
        yes: [setMultiDocketingCheckboxesAction],
      },
      setShowModalFactoryAction('ConfirmInitiatePaperFilingServiceModal'),
    ],
  },
];
