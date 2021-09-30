import { clearModalAction } from '../actions/clearModalAction';
import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { removePetitionerCounselFromCaseAction } from '../actions/CaseAssociation/removePetitionerCounselFromCaseAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const removePetitionerCounselFromCaseSequence =
  showProgressSequenceDecorator([
    clearModalAction,
    removePetitionerCounselFromCaseAction,
    setSaveAlertsForNavigationAction,
    setAlertSuccessAction,
    navigateToCaseDetailCaseInformationActionFactory('parties'),
  ]);
