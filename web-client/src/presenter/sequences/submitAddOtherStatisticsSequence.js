import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { submitOtherStatisticsAction } from '../actions/submitOtherStatisticsAction';

export const submitAddOtherStatisticsSequence = [
  showProgressSequenceDecorator([
    clearErrorAlertsAction,
    submitOtherStatisticsAction,
    {
      error: [setAlertErrorAction],
      success: [
        clearFormAction,
        setSaveAlertsForNavigationAction,
        setCaseDetailPageTabFrozenAction,
        setAlertSuccessAction,
        navigateToCaseDetailCaseInformationActionFactory(),
      ],
    },
  ]),
];
