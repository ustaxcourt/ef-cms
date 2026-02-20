import { clearModalAction } from '../actions/clearModalAction';
import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { removePetitionerAndUpdateCaptionAction } from '../actions/CaseAssociation/removePetitionerAndUpdateCaptionAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setPartyViewTabAfterUpdatingPetitionersAction } from '../actions/setPartyViewTabAfterUpdatingPetitionersAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const removePetitionerAndUpdateCaptionSequence =
  showProgressSequenceDecorator([
    clearModalAction,
    removePetitionerAndUpdateCaptionAction,
    setPartyViewTabAfterUpdatingPetitionersAction,
    setSaveAlertsForNavigationAction,
    setAlertSuccessAction,
    navigateToCaseDetailCaseInformationActionFactory('parties'),
  ]);
