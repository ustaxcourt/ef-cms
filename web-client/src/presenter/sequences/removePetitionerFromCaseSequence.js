import { clearModalAction } from '../actions/clearModalAction';
import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { removePetitionerFromCaseAction } from '../actions/caseAssociation/removePetitionerFromCaseAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const removePetitionerFromCaseSequence = showProgressSequenceDecorator([
  clearModalAction,
  removePetitionerFromCaseAction,
  setSaveAlertsForNavigationAction,
  setAlertSuccessAction,
  navigateToCaseDetailCaseInformationActionFactory('parties'),
]);
