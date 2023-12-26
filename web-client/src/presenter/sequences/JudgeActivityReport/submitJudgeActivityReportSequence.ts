import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../../actions/clearErrorAlertsAction';
import { clearJudgeActivityReportDataAction } from '@web-client/presenter/actions/JudgeActivityReport/clearJudgeActivityReportDataAction';
import { getSubmittedAndCavCasesByJudgeAction } from '@web-client/presenter/actions/JudgeActivityReport/getSubmittedAndCavCasesByJudgeAction';
import { parallel } from 'cerebral';
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
  clearJudgeActivityReportDataAction, // TODO: should this be here?
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
