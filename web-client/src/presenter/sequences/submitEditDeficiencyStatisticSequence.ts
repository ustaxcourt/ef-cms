import { clearConfirmationTextAction } from '../actions/clearConfirmationTextAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setScrollToErrorNotificationAction } from '@web-client/presenter/actions/setScrollToErrorNotificationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { submitEditDeficiencyStatisticAction } from '../actions/submitEditDeficiencyStatisticAction';
import { validateAddDeficiencyStatisticsAction } from '../actions/validateAddDeficiencyStatisticsAction';

export const submitEditDeficiencyStatisticSequence = [
  startShowValidationAction,
  clearErrorAlertsAction,
  validateAddDeficiencyStatisticsAction,
  {
    error: [
      setValidationErrorsAction,
      setScrollToErrorNotificationAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      showProgressSequenceDecorator([
        submitEditDeficiencyStatisticAction,
        {
          error: [setAlertErrorAction],
          success: [
            clearFormAction,
            clearConfirmationTextAction,
            setSaveAlertsForNavigationAction,
            setCaseDetailPageTabFrozenAction,
            setAlertSuccessAction,
            navigateToCaseDetailCaseInformationActionFactory('statistics'),
          ],
        },
      ]),
    ],
  },
];
