import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearCaseDeadlineReportAction } from '../actions/CaseDeadline/clearCaseDeadlineReportAction';
import { getCaseDeadlinesAction } from '../actions/CaseDeadline/getCaseDeadlinesAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setCaseDeadlinesAction } from '../actions/CaseDeadline/setCaseDeadlinesAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { updateDateRangeForDeadlinesAction } from '../actions/CaseDeadline/updateDateRangeForDeadlinesAction';
import { validateSearchDeadlinesAction } from '../actions/CaseDeadline/validateSearchDeadlinesAction';

export const updateDateRangeForDeadlinesSequence =
  showProgressSequenceDecorator([
    validateSearchDeadlinesAction,
    {
      error: [
        startShowValidationAction,
        setAlertErrorAction,
        setValidationErrorsAction,
        setValidationAlertErrorsAction,
      ],
      success: [
        clearAlertsAction,
        updateDateRangeForDeadlinesAction,
        stopShowValidationAction,
        clearCaseDeadlineReportAction,
        getCaseDeadlinesAction,
        setCaseDeadlinesAction,
      ],
    },
  ]);
