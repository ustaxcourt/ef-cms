import { clearModalAction } from '../actions/clearModalAction';
import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { removePetitionerAndUpdateCaptionAction } from '../actions/caseAssociation/removePetitionerAndUpdateCaptionAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';
import { setPartyViewTabAfterRemoveAction } from '../actions/setPartyViewTabAfterRemoveAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const removePetitionerAndUpdateCaptionSequence = showProgressSequenceDecorator(
  [
    clearModalAction,
    removePetitionerAndUpdateCaptionAction,
    setPartyViewTabAfterRemoveAction,
    setCaseDetailPageTabFrozenAction,
    setSaveAlertsForNavigationAction,
    setAlertSuccessAction,
    navigateToCaseDetailCaseInformationActionFactory('parties'),
  ],
);
