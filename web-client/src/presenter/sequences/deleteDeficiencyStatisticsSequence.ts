import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { deleteDeficiencyStatisticsAction } from '../actions/deleteDeficiencyStatisticsAction';
import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const deleteDeficiencyStatisticsSequence = [
  showProgressSequenceDecorator([
    clearErrorAlertsAction,
    deleteDeficiencyStatisticsAction,
    {
      error: [setAlertErrorAction, clearModalAction],
      success: [
        clearFormAction,
        setSaveAlertsForNavigationAction,
        setCaseDetailPageTabFrozenAction,
        setAlertSuccessAction,
        clearModalAction,
        navigateToCaseDetailCaseInformationActionFactory(),
      ],
    },
  ]),
];
