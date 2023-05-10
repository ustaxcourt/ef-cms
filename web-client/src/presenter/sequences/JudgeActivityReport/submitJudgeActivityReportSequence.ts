import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../../actions/clearErrorAlertsAction';
import { getCasesClosedByJudgeAction } from '../../actions/JudgeActivityReport/getCasesClosedByJudgeAction';
import { getOpinionsForJudgeActivityReportAction } from '../../actions/JudgeActivityReport/getOpinionsForJudgeActivityReportAction';
import { getOrdersIssuedForJudgeActivityReportAction } from '../../actions/JudgeActivityReport/getOrdersIssuedForJudgeActivityReportAction';
import { getSubmittedAndCavCasesByJudgeAction } from '../../actions/JudgeActivityReport/getSubmittedAndCavCasesByJudgeAction';
import { getTrialSessionsForJudgeActivityReportAction } from '../../actions/JudgeActivityReport/getTrialSessionsForJudgeActivityReportAction';
import { parallel } from 'cerebral';
import { setAlertErrorAction } from '../../actions/setAlertErrorAction';
import { setJudgeActivityReportDataAction } from '../../actions/JudgeActivityReport/setJudgeActivityReportDataAction';
import { setValidationAlertErrorsAction } from '../../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../../actions/startShowValidationAction';
import { stopShowValidationAction } from '../../actions/stopShowValidationAction';
import { validateJudgeActivityReportSearchAction } from '../../actions/JudgeActivityReport/validateJudgeActivityReportSearchAction';

export const submitJudgeActivityReportSequence = showProgressSequenceDecorator([
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
      parallel([
        getCasesClosedByJudgeAction,
        getTrialSessionsForJudgeActivityReportAction,
        getOpinionsForJudgeActivityReportAction,
        getOrdersIssuedForJudgeActivityReportAction,
        getSubmittedAndCavCasesByJudgeAction,
      ]),
      setJudgeActivityReportDataAction,
    ],
  },
]);
