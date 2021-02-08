import { hasUpdatedEmailAction } from '../actions/hasUpdatedEmailAction';
import { navigateToPractitionerDetailAction } from '../actions/navigateToPractitionerDetailAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const adminContactUpdateInitialUpdateCompleteSequence = [
  unsetWaitingForResponseAction,
  hasUpdatedEmailAction,
  {
    no: [navigateToPractitionerDetailAction],
    yes: [setShowModalFactoryAction('EmailVerificationModal')],
  },
];
