import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../../actions/clearErrorAlertsAction';
import { getCasesClosedByJudgeAction } from '../../actions/JudgeActivityReport/getCasesClosedByJudgeAction';
import { getJudgeActivityReportCountsAction } from '../../actions/JudgeActivityReport/getJudgeActivityReportCountsAction';
import { getSubmittedAndCavCasesByJudgeAction } from '@web-client/presenter/actions/JudgeActivityReport/getSubmittedAndCavCasesByJudgeAction';
import { getTrialSessionsForJudgeActivityReportAction } from '../../actions/JudgeActivityReport/getTrialSessionsForJudgeActivityReportAction';
import { parallel } from 'cerebral';
import { setAlertErrorAction } from '../../actions/setAlertErrorAction';
import { setCavAndSubmittedCasesAction } from '@web-client/presenter/actions/JudgeActivityReport/setCavAndSubmittedCasesAction';
import { setDefaultSubmittedAndCavSortOrderAction } from '@web-client/presenter/actions/JudgeActivityReport/setDefaultSubmittedAndCavSortOrderAction';
import { setHasUserSubmittedFormAction } from '@web-client/presenter/actions/JudgeActivityReport/setHasUserSubmittedFormAction';
import { setJudgeActivityReportDataAction } from '@web-client/presenter/actions/JudgeActivityReport/setJudgeActivityReportDataAction';
import { setJudgeLastNamesAction } from '@web-client/presenter/actions/JudgeActivityReport/setJudgeLastNamesAction';
import { setValidationAlertErrorsAction } from '../../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '@web-client/presenter/utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../../actions/startShowValidationAction';
import { stopShowValidationAction } from '../../actions/stopShowValidationAction';
import { validateJudgeActivityReportSearchAction } from '../../actions/JudgeActivityReport/validateJudgeActivityReportSearchAction';

export const submitJudgeActivityReportSequence = showProgressSequenceDecorator([
  setHasUserSubmittedFormAction,
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
      setDefaultSubmittedAndCavSortOrderAction,
      clearAlertsAction,
      setJudgeLastNamesAction,
      parallel([
        getJudgeActivityReportCountsAction,
        getCasesClosedByJudgeAction,
        getTrialSessionsForJudgeActivityReportAction,
        getSubmittedAndCavCasesByJudgeAction,
      ]),
      setCavAndSubmittedCasesAction,
      setJudgeActivityReportDataAction,
    ],
  },
]);
