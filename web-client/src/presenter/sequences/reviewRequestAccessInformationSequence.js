import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const reviewRequestAccessInformationSequence = [
  clearAlertsAction,
  set(state.showValidation, true),
  computeCertificateOfServiceFormDateAction,
  //plug in validation here when it's completed
  //validateRequestAccessInformationAction,
  /*{
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: [*/
  set(state.showValidation, false),
  clearAlertsAction,
  set(state.wizardStep, 'RequestAccessReview'),
  /*],
  },*/
];
