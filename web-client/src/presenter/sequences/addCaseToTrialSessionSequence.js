import { addCaseToTrialSessionAction } from '../actions/CaseDetail/addCaseToTrialSessionAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { isTrialSessionCalendaredAction } from '../actions/TrialSession/isTrialSessionCalendaredAction';
import { set } from 'cerebral/factories';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setAlertWarningAction } from '../actions/setAlertWarningAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setNoticesForCalendaredTrialSessionAction } from '../actions/TrialSession/setNoticesForCalendaredTrialSessionAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setTrialSessionCalendarAlertWarningAction } from '../actions/TrialSession/setTrialSessionCalendarAlertWarningAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { state } from 'cerebral';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { validateAddToTrialSessionAction } from '../actions/CaseDetail/validateAddToTrialSessionAction';

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
        no: [
          clearModalStateAction,
          unsetWaitingForResponseAction,
          setAlertSuccessAction,
          setCaseAction,
        ],
        yes: [
          setNoticesForCalendaredTrialSessionAction,
          {
            electronic: [
              clearModalStateAction,
              unsetWaitingForResponseAction,
              setAlertSuccessAction,
              setCaseAction,
            ],
            paper: [
              ...setPdfPreviewUrlSequence,
              setTrialSessionCalendarAlertWarningAction,
              setAlertWarningAction,
              set(state.currentPage, 'SimplePdfPreviewPage'),
            ],
          },
        ],
      },
    ],
  },
];
