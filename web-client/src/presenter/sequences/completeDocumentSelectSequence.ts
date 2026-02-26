import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearOtherIterationAction } from '../actions/clearOtherIterationAction';
import { defaultSecondaryDocumentAction } from '../actions/FileDocument/defaultSecondaryDocumentAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { navigateToFileADocumentAction } from '../actions/FileDocument/navigateToFileADocumentAction';
import { refreshExternalDocumentTitleFromEventCodeAction } from '../actions/FileDocument/refreshExternalDocumentTitleFromEventCodeAction';
import { setDefaultFileDocumentFormValuesAction } from '../actions/FileDocument/setDefaultFileDocumentFormValuesAction';
import { setDocketNumberPropAction } from '../actions/FileDocument/setDocketNumberPropAction';
import { setScrollToErrorNotificationAction } from '@web-client/presenter/actions/setScrollToErrorNotificationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateSelectDocumentTypeAction } from '../actions/validateSelectDocumentTypeAction';
import { isNoticeOfWithdrawalAction } from '../actions/isNoticeOfWithdrawalAction';
import { validateNoticeOfWithdrawalAction } from '../actions/validateNoticeOfWithdrawalAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setDefaultPaperServiceAcknowledgementAction } from '../actions/setDefaultPaperServiceAcknowledgementAction';
import { setDefaultPartiesToWithdrawFromMapAction } from '@web-client/presenter/actions/setDefaultPartiesToWithdrawFromMapAction';

const navigationSequence = [
  setDocketNumberPropAction,
  setDefaultFileDocumentFormValuesAction,
  clearOtherIterationAction,
  navigateToFileADocumentAction,
];

export const completeDocumentSelectSequence = [
  startShowValidationAction,
  defaultSecondaryDocumentAction,
  refreshExternalDocumentTitleFromEventCodeAction,
  generateTitleAction,
  validateSelectDocumentTypeAction,
  {
    error: [
      setValidationErrorsAction,
      setScrollToErrorNotificationAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      clearAlertsAction,
      stopShowValidationAction,
      isNoticeOfWithdrawalAction,
      {
        yes: [
          validateNoticeOfWithdrawalAction,
          {
            error: [setAlertErrorAction],
            success: [
              setDefaultPartiesToWithdrawFromMapAction,
              setDefaultPaperServiceAcknowledgementAction,
              navigationSequence,
            ],
          },
        ],
        no: navigationSequence,
      },
    ],
  },
];
