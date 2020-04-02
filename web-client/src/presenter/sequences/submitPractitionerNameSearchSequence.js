import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getPractitionersByNameAction } from '../actions/AdvancedSearch/getPractitionersByNameAction';
import { setPractitionerResultsAction } from '../actions/AdvancedSearch/setPractitionerResultsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const submitPractitionerNameSearchSequence = showProgressSequenceDecorator(
  [
    clearAlertsAction,
    getPractitionersByNameAction,
    setPractitionerResultsAction,
  ],
);
