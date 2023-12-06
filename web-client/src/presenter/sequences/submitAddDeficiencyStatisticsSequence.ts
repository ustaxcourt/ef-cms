import { clearConfirmationTextAction } from '../actions/clearConfirmationTextAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { submitAddDeficiencyStatisticsAction } from '../actions/submitAddDeficiencyStatisticsAction';
import { validateAddDeficiencyStatisticsAction } from '../actions/validateAddDeficiencyStatisticsAction';

export const submitAddDeficiencyStatisticsSequence = [
  startShowValidationAction,
  clearErrorAlertsAction,
  validateAddDeficiencyStatisticsAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      showProgressSequenceDecorator([
        submitAddDeficiencyStatisticsAction,
        {
          error: [setAlertErrorAction],
          success: [
            clearFormAction,
            clearConfirmationTextAction,
            setSaveAlertsForNavigationAction,
            setAlertSuccessAction,
            navigateToCaseDetailCaseInformationActionFactory('statistics'),
          ],
        },
      ]),
    ],
  },
];
