import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../../actions/clearErrorAlertsAction';
import { getSubmittedAndCavCasesByJudgeAction } from '../../actions/JudgeActivityReport/getSubmittedAndCavCasesByJudgeAction';
import { setAlertErrorAction } from '../../actions/setAlertErrorAction';
import { setValidationAlertErrorsAction } from '../../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../../actions/startShowValidationAction';
import { stopShowValidationAction } from '../../actions/stopShowValidationAction';
import { validateJudgeActivityReportSearchAction } from '../../actions/JudgeActivityReport/validateJudgeActivityReportSearchAction';

export const getCavAndSubmittedCasesForJudgesSequence =
  showProgressSequenceDecorator([
    startShowValidationAction,
    validateJudgeActivityReportSearchAction,
    {
      error: [
        setAlertErrorAction,
        setValidationErrorsAction,
        setValidationAlertErrorsAction,
      ],
      success: [
        stopShowValidationAction,
        clearErrorAlertsAction,
        clearAlertsAction,
        getSubmittedAndCavCasesByJudgeAction,
      ],
    },
  ]);
