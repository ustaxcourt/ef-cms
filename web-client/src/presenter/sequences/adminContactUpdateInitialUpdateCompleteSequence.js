import { navigateToPractitionerDetailAction } from '../actions/navigateToPractitionerDetailAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { shouldCheckEmailAvailabilityAction } from '../actions/shouldCheckEmailAvailabilityAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const adminContactUpdateInitialUpdateCompleteSequence = [
  unsetWaitingForResponseAction,
  shouldCheckEmailAvailabilityAction,
  {
    no: [navigateToPractitionerDetailAction],
    yes: [setShowModalFactoryAction('EmailVerificationModal')],
  },
];
