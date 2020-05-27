import { clearFormAction } from '../actions/clearFormAction';
import { navigateToCaseDetailCaseInformationAction } from '../actions/navigateToCaseDetailCaseInformationAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { submitAddDeficiencyStatisticsAction } from '../actions/submitAddDeficiencyStatisticsAction';

export const submitAddDeficiencyStatisticsSequence = [
  showProgressSequenceDecorator([
    submitAddDeficiencyStatisticsAction,
    {
      error: [],
      success: [
        clearFormAction,
        setSaveAlertsForNavigationAction,
        setAlertSuccessAction,
        navigateToCaseDetailCaseInformationAction,
      ],
    },
  ]),
];
