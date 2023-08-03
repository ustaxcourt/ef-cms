import { checkJudgeActivityReportOpinionsAndOrdersIsSetAction } from '@web-client/presenter/actions/JudgeActivityReport/checkJudgeActivityReportOpinionsAndOrdersIsSetAction';
import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../../actions/clearErrorAlertsAction';
import { getCasesClosedByJudgeAction } from '../../actions/JudgeActivityReport/getCasesClosedByJudgeAction';
import { getOpinionsForJudgeActivityReportAction } from '../../actions/JudgeActivityReport/getOpinionsForJudgeActivityReportAction';
import { getOrdersIssuedForJudgeActivityReportAction } from '../../actions/JudgeActivityReport/getOrdersIssuedForJudgeActivityReportAction';
import { getSubmittedAndCavCasesByJudgeAction } from '@web-client/presenter/actions/JudgeActivityReport/getSubmittedAndCavCasesByJudgeAction';
import { getTrialSessionsForJudgeActivityReportAction } from '../../actions/JudgeActivityReport/getTrialSessionsForJudgeActivityReportAction';
import { parallel } from 'cerebral';
import { resetJudgeActivityReportDataAction } from '@web-client/presenter/actions/JudgeActivityReport/resetJudgeActivityReportDataAction';
import { setAlertErrorAction } from '../../actions/setAlertErrorAction';
import { setCavAndSubmittedCasesAction } from '@web-client/presenter/actions/JudgeActivityReport/setCavAndSubmittedCasesAction';
import { setJudgeActivityReportDataAction } from '@web-client/presenter/actions/JudgeActivityReport/setJudgeActivityReportDataAction';
import { setJudgeLastNamesAction } from '@web-client/presenter/actions/JudgeActivityReport/setJudgeLastNamesAction';
import { setValidationAlertErrorsAction } from '../../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '@web-client/presenter/actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../../actions/startShowValidationAction';
import { stopShowValidationAction } from '../../actions/stopShowValidationAction';
import { unsetWaitingForResponseAction } from '@web-client/presenter/actions/unsetWaitingForResponseAction';
import { validateJudgeActivityReportSearchAction } from '../../actions/JudgeActivityReport/validateJudgeActivityReportSearchAction';

export const submitJudgeActivityReportSequence = [
  resetJudgeActivityReportDataAction,
  startShowValidationAction,
  validateJudgeActivityReportSearchAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      setWaitingForResponseAction,
      stopShowValidationAction,
      clearErrorAlertsAction,
      clearAlertsAction,
      setJudgeLastNamesAction,
      getOpinionsForJudgeActivityReportAction,
      getOrdersIssuedForJudgeActivityReportAction,
      parallel([
        getCasesClosedByJudgeAction,
        getTrialSessionsForJudgeActivityReportAction,
        getSubmittedAndCavCasesByJudgeAction,
      ]),
      setCavAndSubmittedCasesAction,
      setJudgeActivityReportDataAction,
      checkJudgeActivityReportOpinionsAndOrdersIsSetAction,
      {
        no: [],
        yes: [unsetWaitingForResponseAction],
      },
    ],
  },
];
