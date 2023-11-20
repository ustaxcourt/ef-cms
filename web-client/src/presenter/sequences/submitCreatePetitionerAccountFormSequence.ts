import { clearAlertsAction } from '@web-client/presenter/actions/clearAlertsAction';
import { clearFormAction } from '@web-client/presenter/actions/clearFormAction';
import { createConfirmLinkLocalAction } from '@web-client/presenter/actions/createConfirmLinkLocalAction';
import { createNewPetitionerUserAction } from '@web-client/presenter/actions/createNewPetitionerUserAction';
import { navigateToVerificationSentAction } from '@web-client/presenter/actions/navigateToVerificationSentAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setAlertSuccessAction } from '@web-client/presenter/actions/setAlertSuccessAction';
import { setNewAccountEmailInStateAction } from '@web-client/presenter/actions/setNewAccountEmailInStateAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const submitCreatePetitionerAccountFormSequence = [
  clearAlertsAction,
  createNewPetitionerUserAction,
  {
    error: [setAlertErrorAction],
    success: showProgressSequenceDecorator([
      createConfirmLinkLocalAction,
      setAlertSuccessAction,
      clearFormAction,
      setNewAccountEmailInStateAction,
      navigateToVerificationSentAction,
    ]),
  },
];
