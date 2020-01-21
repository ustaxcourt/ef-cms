import { caseExistsAction } from '../actions/caseExistsAction';
import { clearAdvancedSearchFormAction } from '../actions/clearAdvancedSearchFormAction';
import { clearSearchTermAction } from '../actions/clearSearchTermAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { set, unset } from 'cerebral/factories';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setDocketNumberFromAdvancedSearchAction } from '../actions/AdvancedSearch/setDocketNumberFromAdvancedSearchAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { state } from 'cerebral';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { validateCaseDocketNumberSearchAction } from '../actions/AdvancedSearch/validateCaseDocketNumberSearchAction';

export const submitCaseDocketNumberSearchSequence = [
  clearSearchTermAction,
  clearAdvancedSearchFormAction,
  validateCaseDocketNumberSearchAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      unset(state.searchResults),
    ],
    success: [
      setWaitingForResponseAction,
      setDocketNumberFromAdvancedSearchAction,
      caseExistsAction,
      {
        error: [unsetWaitingForResponseAction, set(state.searchResults, [])],
        success: [unsetWaitingForResponseAction, navigateToCaseDetailAction],
      },
    ],
  },
];
