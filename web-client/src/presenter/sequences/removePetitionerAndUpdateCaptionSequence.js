import { clearModalAction } from '../actions/clearModalAction';
import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { removePetitionerAndUpdateCaptionAction } from '../actions/caseAssociation/removePetitionerAndUpdateCaptionAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';
import { setPartyViewTabAfterUpdatingPetitionersAction } from '../actions/setPartyViewTabAfterUpdatingPetitionersAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const removePetitionerAndUpdateCaptionSequence =
  showProgressSequenceDecorator([
    clearModalAction,
    removePetitionerAndUpdateCaptionAction,
    setPartyViewTabAfterUpdatingPetitionersAction,
    setCaseDetailPageTabFrozenAction,
    setSaveAlertsForNavigationAction,
    setAlertSuccessAction,
    navigateToCaseDetailCaseInformationActionFactory('parties'),
  ]);
