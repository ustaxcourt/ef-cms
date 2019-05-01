import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { computeDateReceivedAction } from '../actions/DocketEntry/computeDateReceivedAction';
import { set } from 'cerebral/factories';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { state } from 'cerebral';
import { validateDocketEntryAction } from '../actions/DocketEntry/validateDocketEntryAction';

export const submitDocketEntrySequence = [
  clearAlertsAction,
  set(state.showValidation, true),
  computeCertificateOfServiceFormDateAction,
  computeDateReceivedAction,
  validateDocketEntryAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: [set(state.showValidation, false), clearAlertsAction],
  },
];
