import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { clearSearchResultsAction } from '../../actions/AdvancedSearch/clearSearchResultsAction';
import { clearSearchTermAction } from '../../actions/clearSearchTermAction';
import { defaultCaseSearchDatesAction } from '@web-client/presenter/actions/AdvancedSearch/defaultCaseSearchDatesAction';
import { setAdvancedSearchResultsAction } from '../../actions/AdvancedSearch/setAdvancedSearchResultsAction';
import { setScrollToErrorNotificationAction } from '@web-client/presenter/actions/setScrollToErrorNotificationAction';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '@web-client/presenter/actions/startShowValidationAction';
import { submitPublicCaseAdvancedSearchAction } from '../../actions/Public/submitPublicCaseAdvancedSearchAction';
import { validateCaseAdvancedSearchAction } from '../../actions/AdvancedSearch/validateCaseAdvancedSearchAction';

export const submitPublicCaseAdvancedSearchSequence = [
  clearSearchTermAction,
  defaultCaseSearchDatesAction,
  validateCaseAdvancedSearchAction,
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
      submitPublicCaseAdvancedSearchAction,
      setAdvancedSearchResultsAction,
    ]),
  },
];
