import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearCaseDeadlineReportAction } from '../actions/CaseDeadline/clearCaseDeadlineReportAction';
import { getCaseDeadlinesAction } from '../actions/CaseDeadline/getCaseDeadlinesAction';
import { setCaseDeadlinesAction } from '../actions/CaseDeadline/setCaseDeadlinesAction';
import { setScrollToErrorNotificationAction } from '@web-client/presenter/actions/setScrollToErrorNotificationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
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
        setValidationErrorsAction,
        setScrollToErrorNotificationAction,
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
