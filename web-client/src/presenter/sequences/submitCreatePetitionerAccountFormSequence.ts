import { clearAlertsAction } from '@web-client/presenter/actions/clearAlertsAction';
import { clearFormAction } from '@web-client/presenter/actions/clearFormAction';
import { createConfirmLinkLocal } from '@web-client/presenter/actions/createConfirmLinkLocalAction';
import { createPetitionerAccountFormAction } from '@web-client/presenter/actions/createPetitionerAccountFormAction';
import { navigateToVerificationSentAction } from '@web-client/presenter/actions/navigateToVerificationSentAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setAlertSuccessAction } from '@web-client/presenter/actions/setAlertSuccessAction';
import { setNewAccountEmailInStateAction } from '@web-client/presenter/actions/setNewAccountEmailInStateAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const submitCreatePetitionerAccountFormSequence = [
  clearAlertsAction,
  createPetitionerAccountFormAction,
  {
    error: [setAlertErrorAction],
    success: showProgressSequenceDecorator([
      createConfirmLinkLocal,
      setAlertSuccessAction,
      clearFormAction,
      setNewAccountEmailInStateAction,
      navigateToVerificationSentAction,
    ]),
  },
];
