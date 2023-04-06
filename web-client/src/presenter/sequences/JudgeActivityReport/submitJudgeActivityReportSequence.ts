import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../../actions/clearErrorAlertsAction';
import { getComputedFormDateFactoryAction } from '../../actions/getComputedFormDateFactoryAction';
import { getJudgeActivityReportReportAction } from '../../actions/JudgeActivityReport/getJudgeActivityReportReportAction';
import { setAlertErrorAction } from '../../actions/setAlertErrorAction';
import { setValidationAlertErrorsAction } from '../../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../../actions/startShowValidationAction';
import { stopShowValidationAction } from '../../actions/stopShowValidationAction';
import { validateJudgeActivityReportSearchAction } from '../../actions/JudgeActivityReport/validateJudgeActivityReportSearchAction';

export const submitJudgeActivityReportSequence = showProgressSequenceDecorator([
  startShowValidationAction,
  getComputedFormDateFactoryAction('start', false, 'computedStartDate'),
  getComputedFormDateFactoryAction('end', false, 'computedEndDate'),
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
      getJudgeActivityReportReportAction,
    ],
  },
]);
