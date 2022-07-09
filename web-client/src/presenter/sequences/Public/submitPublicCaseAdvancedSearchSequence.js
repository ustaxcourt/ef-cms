import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { clearSearchResultsAction } from '../../actions/AdvancedSearch/clearSearchResultsAction';
import { clearSearchTermAction } from '../../actions/clearSearchTermAction';
import { setAdvancedSearchResultsAction } from '../../actions/AdvancedSearch/setAdvancedSearchResultsAction';
import { setAlertErrorAction } from '../../actions/setAlertErrorAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';
import {
  submitPublicCaseAdvancedSearchAction,
  submitPublicCaseAdvancedSearchWhileFeelingLuckyAction,
} from '../../actions/Public/submitPublicCaseAdvancedSearchAction';
import { validateCaseAdvancedSearchAction } from '../../actions/AdvancedSearch/validateCaseAdvancedSearchAction';

export const submitPublicCaseAdvancedSearchSequence = [
  clearSearchTermAction,
  validateCaseAdvancedSearchAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      clearSearchResultsAction,
    ],
    success: showProgressSequenceDecorator([
      clearAlertsAction,
      submitPublicCaseAdvancedSearchAction,
      setAdvancedSearchResultsAction,
    ]),
  },
];

export const submitPublicCaseAdvancedSearchSequenceWhileFeelinLucky = [
  clearSearchTermAction,
  validateCaseAdvancedSearchAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      clearSearchResultsAction,
    ],
    success: showProgressSequenceDecorator([
      clearAlertsAction,
      submitPublicCaseAdvancedSearchWhileFeelingLuckyAction,
    ]),
  },
];
