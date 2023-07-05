import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearSearchResultsAction } from '../actions/AdvancedSearch/clearSearchResultsAction';
import { clearSearchTermAction } from '../actions/clearSearchTermAction';
import { setAdvancedSearchResultsAction } from '../actions/AdvancedSearch/setAdvancedSearchResultsAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { submitOpinionAdvancedSearchAction } from '../actions/AdvancedSearch/submitOpinionAdvancedSearchAction';
import { validateOpinionAdvancedSearchAction } from '../actions/AdvancedSearch/validateOpinionAdvancedSearchAction';

export const submitOpinionAdvancedSearchSequence =
  showProgressSequenceDecorator([
    clearSearchTermAction,
    validateOpinionAdvancedSearchAction,
    {
      error: [
        setAlertErrorAction,
        setValidationErrorsAction,
        clearSearchResultsAction,
        startShowValidationAction,
      ],
      success: showProgressSequenceDecorator([
        clearAlertsAction,
        submitOpinionAdvancedSearchAction,
        setAdvancedSearchResultsAction,
      ]),
    },
  ]);
