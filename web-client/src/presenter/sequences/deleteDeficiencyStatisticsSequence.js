import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { deleteDeficiencyStatisticsAction } from '../actions/deleteDeficiencyStatisticsAction';
import { navigateToCaseDetailCaseInformationAction } from '../actions/navigateToCaseDetailCaseInformationAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const deleteDeficiencyStatisticsSequence = [
  showProgressSequenceDecorator([
    deleteDeficiencyStatisticsAction,
    {
      error: [],
      success: [
        clearFormAction,
        setSaveAlertsForNavigationAction,
        setCaseDetailPageTabFrozenAction,
        setAlertSuccessAction,
        clearModalAction,
        navigateToCaseDetailCaseInformationAction,
      ],
    },
  ]),
];
