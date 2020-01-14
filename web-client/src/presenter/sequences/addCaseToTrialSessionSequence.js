import { addCaseToTrialSessionAction } from '../actions/CaseDetail/addCaseToTrialSessionAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getAddCaseToTrialSessionCalendarAlertWarningAction } from '../actions/TrialSession/getAddCaseToTrialSessionCalendarAlertWarningAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { isTrialSessionCalendaredAction } from '../actions/TrialSession/isTrialSessionCalendaredAction';
import { set } from 'cerebral/factories';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setAlertWarningAction } from '../actions/setAlertWarningAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setNoticesForCalendaredTrialSessionAction } from '../actions/TrialSession/setNoticesForCalendaredTrialSessionAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { state } from 'cerebral';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { validateAddToTrialSessionAction } from '../actions/CaseDetail/validateAddToTrialSessionAction';

const showSuccessAlert = [
  clearModalStateAction,
  unsetWaitingForResponseAction,
  setAlertSuccessAction,
  getCaseAction,
  setCaseAction,
];

export const addCaseToTrialSessionSequence = [
  startShowValidationAction,
  validateAddToTrialSessionAction,
  {
    error: [setValidationErrorsAction],
    success: [
      setWaitingForResponseAction,
      clearModalAction,
      addCaseToTrialSessionAction,
      getTrialSessionDetailsAction,
      isTrialSessionCalendaredAction,
      {
        no: showSuccessAlert,
        yes: [
          setNoticesForCalendaredTrialSessionAction,
          {
            electronic: showSuccessAlert,
            paper: [
              clearModalStateAction,
              unsetWaitingForResponseAction,
              ...setPdfPreviewUrlSequence,
              getAddCaseToTrialSessionCalendarAlertWarningAction,
              setAlertWarningAction,
              set(state.currentPage, 'SimplePdfPreviewPage'),
            ],
          },
        ],
      },
    ],
  },
];
