import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../../actions/clearErrorAlertsAction';
import { clearJudgeActivityReportFiltersAction } from '@web-client/presenter/actions/JudgeActivityReport/clearJudgeActivityReportFiltersAction';
import { clearJudgeActivityStatisticsReportDataAction } from '@web-client/presenter/actions/JudgeActivityReport/clearJudgeActivityStatisticsReportDataAction';
import { getSubmittedAndCavCasesByJudgeAction } from '@web-client/presenter/actions/JudgeActivityReport/getSubmittedAndCavCasesByJudgeAction';
import { parallel } from 'cerebral';
import { resetHasUserSubmittedFormAction } from '@web-client/presenter/actions/JudgeActivityReport/resetHasUserSubmittedFormAction';
import { setAlertErrorAction } from '../../actions/setAlertErrorAction';
import { setCavAndSubmittedCasesAction } from '@web-client/presenter/actions/JudgeActivityReport/setCavAndSubmittedCasesAction';
import { setDefaultSubmittedAndCavSortOrderAction } from '@web-client/presenter/actions/JudgeActivityReport/setDefaultSubmittedAndCavSortOrderAction';
import { setJudgeLastNamesAction } from '@web-client/presenter/actions/JudgeActivityReport/setJudgeLastNamesAction';
import { setValidationAlertErrorsAction } from '../../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '@web-client/presenter/utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../../actions/startShowValidationAction';
import { stopShowValidationAction } from '../../actions/stopShowValidationAction';
import { validateJudgeActivityReportSearchAction } from '../../actions/JudgeActivityReport/validateJudgeActivityReportSearchAction';

export const submitJudgeActivityReportSequence = showProgressSequenceDecorator([
  clearJudgeActivityStatisticsReportDataAction,
  clearJudgeActivityReportFiltersAction,
  resetHasUserSubmittedFormAction,
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
      parallel([getSubmittedAndCavCasesByJudgeAction]),
      setCavAndSubmittedCasesAction,
    ],
  },
]);
