import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateCourtIssuedDocketEntryAction } from '../actions/CourtIssuedDocketEntry/validateCourtIssuedDocketEntryAction';

export const openConfirmInitiateServiceModalSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateCourtIssuedDocketEntryAction,
  {
    error: [setValidationErrorsAction, setValidationAlertErrorsAction],
    success: [
      clearModalStateAction,
      setShowModalFactoryAction('ConfirmInitiateServiceModal'),
    ],
  },
];
