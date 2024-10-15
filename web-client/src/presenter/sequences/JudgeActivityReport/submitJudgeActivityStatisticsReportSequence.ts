import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../../actions/clearErrorAlertsAction';
import { getCasesClosedByJudgeAction } from '../../actions/JudgeActivityReport/getCasesClosedByJudgeAction';
import { getJudgeActivityReportCountsAction } from '../../actions/JudgeActivityReport/getJudgeActivityReportCountsAction';
import { getTrialSessionsForJudgeActivityReportAction } from '../../actions/JudgeActivityReport/getTrialSessionsForJudgeActivityReportAction';
import { parallel } from 'cerebral';
import { setHasUserSubmittedFormAction } from '@web-client/presenter/actions/JudgeActivityReport/setHasUserSubmittedFormAction';
import { setJudgeActivityReportDataAction } from '@web-client/presenter/actions/JudgeActivityReport/setJudgeActivityReportDataAction';
import { setScrollToErrorNotificationAction } from '@web-client/presenter/actions/setScrollToErrorNotificationAction';
import { setValidationAlertErrorsAction } from '../../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '@web-client/presenter/utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../../actions/startShowValidationAction';
import { stopShowValidationAction } from '../../actions/stopShowValidationAction';
import { validateJudgeActivityStatisticsReportSearchAction } from '@web-client/presenter/actions/JudgeActivityReport/validateJudgeActivityStatisticsReportSearchAction';

export const submitJudgeActivityStatisticsReportSequence =
  showProgressSequenceDecorator([
    setHasUserSubmittedFormAction,
    startShowValidationAction,
    validateJudgeActivityStatisticsReportSearchAction,
    {
      error: [
        setValidationErrorsAction,
        setScrollToErrorNotificationAction,
        setValidationAlertErrorsAction,
      ],
      success: [
        stopShowValidationAction,
        clearErrorAlertsAction,
        clearAlertsAction,
        parallel([
          getJudgeActivityReportCountsAction,
          getCasesClosedByJudgeAction,
          getTrialSessionsForJudgeActivityReportAction,
        ]),
        setJudgeActivityReportDataAction,
      ],
    },
  ]);
