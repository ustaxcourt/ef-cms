import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../../actions/clearErrorAlertsAction';
import { clearJudgeActivityReportStatisticsDataAction } from '@web-client/presenter/actions/JudgeActivityReport/clearJudgeActivityReportStatisticsDataAction';
import { clearJudgeActivityReportStatisticsFiltersAction } from '@web-client/presenter/actions/JudgeActivityReport/clearJudgeActivityReportStatisticsFiltersAction';
import { getPendingMotionDocketEntriesAction } from '@web-client/presenter/actions/PendingMotion/getPendingMotionDocketEntriesAction';
import { getSubmittedAndCavCasesByJudgeAction } from '@web-client/presenter/actions/JudgeActivityReport/getSubmittedAndCavCasesByJudgeAction';
import { parallel } from 'cerebral';
import { resetHasUserSubmittedFormAction } from '@web-client/presenter/actions/JudgeActivityReport/resetHasUserSubmittedFormAction';
import { setAlertErrorAction } from '../../actions/setAlertErrorAction';
import { setCavAndSubmittedCasesAction } from '@web-client/presenter/actions/JudgeActivityReport/setCavAndSubmittedCasesAction';
import { setDefaultSubmittedAndCavSortOrderAction } from '@web-client/presenter/actions/JudgeActivityReport/setDefaultSubmittedAndCavSortOrderAction';
import { setJudgeActivityReportFiltersAction } from '@web-client/presenter/actions/JudgeActivityReport/setJudgeActivityReportFiltersAction';
import { setPendingMotionDocketEntriesForCurrentJudgeAction } from '@web-client/presenter/actions/PendingMotion/setPendingMotionDocketEntriesForCurrentJudgeAction';
import { setValidationAlertErrorsAction } from '../../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '@web-client/presenter/utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../../actions/startShowValidationAction';
import { stopShowValidationAction } from '../../actions/stopShowValidationAction';
import { validateJudgeActivityReportSearchAction } from '../../actions/JudgeActivityReport/validateJudgeActivityReportSearchAction';

export const submitJudgeActivityReportSequence = showProgressSequenceDecorator([
  clearJudgeActivityReportStatisticsDataAction,
  clearJudgeActivityReportStatisticsFiltersAction,
  setJudgeActivityReportFiltersAction,
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
      parallel([
        getSubmittedAndCavCasesByJudgeAction,
        getPendingMotionDocketEntriesAction,
      ]),
      setCavAndSubmittedCasesAction,
      setPendingMotionDocketEntriesForCurrentJudgeAction,
    ],
  },
]);
