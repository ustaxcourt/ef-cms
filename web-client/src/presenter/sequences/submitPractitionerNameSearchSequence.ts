import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearSearchResultsAction } from '../actions/AdvancedSearch/clearSearchResultsAction';
import { getPractitionersByNameAction } from '../actions/AdvancedSearch/getPractitionersByNameAction';
import { setAdvancedSearchResultsAction } from '../actions/AdvancedSearch/setAdvancedSearchResultsAction';
import { setScrollToErrorNotificationAction } from '@web-client/presenter/actions/setScrollToErrorNotificationAction';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validatePractitionerSearchByNameAction } from '../actions/AdvancedSearch/validatePractitionerSearchByNameAction';

export const submitPractitionerNameSearchSequence = [
  startShowValidationAction,
  validatePractitionerSearchByNameAction,
  {
    error: [
      setValidationErrorsAction,
      setScrollToErrorNotificationAction,
      setValidationAlertErrorsAction,
      clearSearchResultsAction,
    ],
    success: showProgressSequenceDecorator([
      stopShowValidationAction,
      clearAlertsAction,
      getPractitionersByNameAction,
      setAdvancedSearchResultsAction,
    ]),
  },
];
