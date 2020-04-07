import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearSearchResultsAction } from '../actions/AdvancedSearch/clearSearchResultsAction';
import { getPractitionersByNameAction } from '../actions/AdvancedSearch/getPractitionersByNameAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setPractitionerResultsAction } from '../actions/AdvancedSearch/setPractitionerResultsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { validatePractitionerSearchByNameAction } from '../actions/AdvancedSearch/validatePractitionerSearchByNameAction';

export const submitPractitionerNameSearchSequence = [
  validatePractitionerSearchByNameAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      clearSearchResultsAction,
    ],
    success: showProgressSequenceDecorator([
      clearAlertsAction,
      getPractitionersByNameAction,
      setPractitionerResultsAction,
    ]),
  },
];
