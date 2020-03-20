import { caseExistsAction } from '../actions/caseExistsAction';
import { clearCaseSearchByNameFormAction } from '../actions/clearCaseSearchByNameFormAction';
import { clearSearchTermAction } from '../actions/clearSearchTermAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { set, unset } from 'cerebral/factories';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setDefaultCountryTypeOnAdvancedSearchFormAction } from '../actions/AdvancedSearch/setDefaultCountryTypeOnAdvancedSearchFormAction';
import { setDocketNumberFromAdvancedSearchAction } from '../actions/AdvancedSearch/setDocketNumberFromAdvancedSearchAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { state } from 'cerebral';
import { validateCaseDocketNumberSearchAction } from '../actions/AdvancedSearch/validateCaseDocketNumberSearchAction';

export const submitCaseDocketNumberSearchSequence = [
  clearSearchTermAction,
  clearCaseSearchByNameFormAction,
  setDefaultCountryTypeOnAdvancedSearchFormAction,
  validateCaseDocketNumberSearchAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      unset(state.searchResults),
    ],
    success: showProgressSequenceDecorator([
      setDocketNumberFromAdvancedSearchAction,
      caseExistsAction,
      {
        error: [set(state.searchResults, [])],
        success: [navigateToCaseDetailAction],
      },
    ]),
  },
];
