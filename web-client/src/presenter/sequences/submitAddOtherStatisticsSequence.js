import { clearFormAction } from '../actions/clearFormAction';
import { navigateToCaseDetailCaseInformationAction } from '../actions/navigateToCaseDetailCaseInformationAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { submitAddOtherStatisticsAction } from '../actions/submitAddOtherStatisticsAction';

export const submitAddOtherStatisticsSequence = [
  showProgressSequenceDecorator([
    submitAddOtherStatisticsAction,
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
