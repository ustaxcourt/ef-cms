import { clearModalAction } from '../actions/clearModalAction';
import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { removePetitionerAndUpdateCaptionAction } from '../actions/caseAssociation/removePetitionerAndUpdateCaptionAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const removePetitionerAndUpdateCaptionSequence = showProgressSequenceDecorator(
  [
    clearModalAction,
    removePetitionerAndUpdateCaptionAction,
    setSaveAlertsForNavigationAction,
    setAlertSuccessAction,
    navigateToCaseDetailCaseInformationActionFactory('parties'),
  ],
);
