import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { computeDateReceivedAction } from '../actions/DocketEntry/computeDateReceivedAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateDocketEntryAction } from '../actions/DocketEntry/validateDocketEntryAction';

export const openConfirmPaperServiceModalSequence = [
  clearAlertsAction,
  startShowValidationAction,
  computeDateReceivedAction,
  validateDocketEntryAction,
  {
    error: [setValidationErrorsAction, setValidationAlertErrorsAction],
    success: [
      generateTitleAction,
      clearModalStateAction,
      setShowModalFactoryAction('ConfirmInitiateServiceModal'),
    ],
  },
];
