import { clearModalStateAction } from '@web-client/presenter/actions/clearModalStateAction';
import { downloadXlsxAction } from '@web-client/presenter/actions/downloadXlsxAction';
import { formatAlertWarningForTermGeneratorAction } from '@web-client/presenter/actions/TrialSession/formatAlertWarningForTermGeneratorAction';
import { formatCreateTermDatesAction } from '@web-client/presenter/actions/TrialSession/formatCreateTermDatesAction';
import { runCreateTermAction } from '@web-client/presenter/actions/TrialSession/runCreateTermAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setAlertSuccessAction } from '@web-client/presenter/actions/setAlertSuccessAction';
import { setAlertWarningAction } from '@web-client/presenter/actions/setAlertWarningAction';
import { showProgressSequenceDecorator } from '@web-client/presenter/utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '@web-client/presenter/actions/startShowValidationAction';
import { validateCreateTermFormAction } from '@web-client/presenter/actions/TrialSession/validateCreateTermFormAction';
import { clearErrorAlertsAction } from '@web-client/presenter/actions/clearErrorAlertsAction';

export const submitCreateTermFormSequence = [
  clearErrorAlertsAction,
  startShowValidationAction,
  validateCreateTermFormAction,
  {
    error: [setAlertErrorAction],
    success: showProgressSequenceDecorator([
      formatCreateTermDatesAction,
      runCreateTermAction,
      {
        error: [setAlertErrorAction, clearModalStateAction],
        success: [
          downloadXlsxAction,
          setAlertSuccessAction,
          clearModalStateAction,
        ],
        warning: [
          downloadXlsxAction,
          formatAlertWarningForTermGeneratorAction,
          setAlertWarningAction,
          clearModalStateAction,
        ],
      },
    ]),
  },
];
