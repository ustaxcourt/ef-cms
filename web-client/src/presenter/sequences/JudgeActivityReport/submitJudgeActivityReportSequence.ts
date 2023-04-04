import { getComputedFormDateFactoryAction } from '../../actions/getComputedFormDateFactoryAction';
import { setAlertErrorAction } from '../../actions/setAlertErrorAction';
import { setValidationAlertErrorsAction } from '../../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../../actions/startShowValidationAction';
import { validateJudgeActivityReportSearchAction } from '../../actions/JudgeActivityReport/validateJudgeActivityReportSearchAction';

export const submitJudgeActivityReportSequence = showProgressSequenceDecorator([
  getComputedFormDateFactoryAction('start', false, 'computedStartDate'),
  getComputedFormDateFactoryAction('end', false, 'computedEndDate'),
  validateJudgeActivityReportSearchAction,
  {
    error: [
      startShowValidationAction,
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: [],
  },
]);
