import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearPractitionerDetailAction } from '../actions/clearPractitionerDetailAction';
import { clearSearchResultsAction } from '../actions/AdvancedSearch/clearSearchResultsAction';
import { getFormValueBarNumberAction } from '../actions/getFormValueBarNumberAction';
import { getPractitionerDetailAction } from '../actions/getPractitionerDetailAction';
import { hasPractitionerDetailAction } from '../actions/hasPractitionerDetailAction';
import { navigateToPractitionerDetailSequence } from './navigateToPractitionerDetailSequence';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setPractitionerDetailAction } from '../actions/setPractitionerDetailAction';
import { setPractitionerResultsAction } from '../actions/AdvancedSearch/setPractitionerResultsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validatePractitionerSearchByBarNumberAction } from '../actions/AdvancedSearch/validatePractitionerSearchByBarNumberAction';

export const submitPractitionerBarNumberSearchSequence = [
  startShowValidationAction,
  validatePractitionerSearchByBarNumberAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      clearSearchResultsAction,
    ],
    success: showProgressSequenceDecorator([
      stopShowValidationAction,
      clearAlertsAction,
      clearPractitionerDetailAction,
      getFormValueBarNumberAction,
      getPractitionerDetailAction,
      hasPractitionerDetailAction,
      {
        noResults: [setPractitionerResultsAction],
        success: [
          setPractitionerDetailAction,
          ...navigateToPractitionerDetailSequence,
        ],
      },
    ]),
  },
];
