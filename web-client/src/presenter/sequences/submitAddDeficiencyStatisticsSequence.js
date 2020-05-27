import { clearFormAction } from '../actions/clearFormAction';
import { getCaseAction } from '../actions/getCaseAction';
import { navigateToCaseDetailCaseInformationAction } from '../actions/navigateToCaseDetailCaseInformationAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';
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
        setCaseDetailPageTabFrozenAction,
        setAlertSuccessAction,
        getCaseAction,
        setCaseAction,
        navigateToCaseDetailCaseInformationAction,
      ],
    },
  ]),
];
