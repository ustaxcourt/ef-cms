import { clearFormAction } from '../actions/clearFormAction';
import { navigateToCaseDetailCaseInformationAction } from '../actions/navigateToCaseDetailCaseInformationAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { submitAddDeficiencyStatisticsAction } from '../actions/submitAddDeficiencyStatisticsAction';
import { validateAddDeficiencyStatisticsAction } from '../actions/validateAddDeficiencyStatisticsAction';

export const submitAddDeficiencyStatisticsSequence = [
  startShowValidationAction,
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
          error: [],
          success: [
            clearFormAction,
            setSaveAlertsForNavigationAction,
            setCaseDetailPageTabFrozenAction,
            setAlertSuccessAction,
            navigateToCaseDetailCaseInformationAction,
          ],
        },
      ]),
    ],
  },
];
