import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { clearSearchResultsAction } from '../../actions/AdvancedSearch/clearSearchResultsAction';
import { clearSearchTermAction } from '../../actions/clearSearchTermAction';
import { setAdvancedSearchResultsAction } from '../../actions/AdvancedSearch/setAdvancedSearchResultsAction';
import { setScrollToErrorNotificationAction } from '@web-client/presenter/actions/setScrollToErrorNotificationAction';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../../actions/startShowValidationAction';
import { submitPublicOrderAdvancedSearchAction } from '../../actions/Public/submitPublicOrderAdvancedSearchAction';
import { validateOrderAdvancedSearchAction } from '../../actions/AdvancedSearch/validateOrderAdvancedSearchAction';

export const submitPublicOrderAdvancedSearchSequence = [
  clearSearchTermAction,
  validateOrderAdvancedSearchAction,
  {
    error: [
      startShowValidationAction,
      setValidationErrorsAction,
      setScrollToErrorNotificationAction,
      setValidationAlertErrorsAction,
      clearSearchResultsAction,
    ],
    success: showProgressSequenceDecorator([
      clearAlertsAction,
      submitPublicOrderAdvancedSearchAction,
      setAdvancedSearchResultsAction,
    ]),
  },
];
