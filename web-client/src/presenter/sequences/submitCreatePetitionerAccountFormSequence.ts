import { clearAlertsAction } from '@web-client/presenter/actions/clearAlertsAction';
import { clearFormAction } from '@web-client/presenter/actions/clearFormAction';
import { createConfirmLinkAction } from '@web-client/presenter/actions/createConfirmLinkAction';
import { createNewPetitionerUserAction } from '@web-client/presenter/actions/CreateAccount/createNewPetitionerUserAction';
import { navigateToVerificationSentAction } from '@web-client/presenter/actions/navigateToVerificationSentAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setAlertSuccessAction } from '@web-client/presenter/actions/setAlertSuccessAction';
import { setAlertWarningAction } from '@web-client/presenter/actions/setAlertWarningAction';
import { setNewAccountEmailInStateAction } from '@web-client/presenter/actions/setNewAccountEmailInStateAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { validateNewPetitionerAction } from '@web-client/presenter/actions/CreateAccount/validateNewPetitionerAction';

export const submitCreatePetitionerAccountFormSequence = [
  clearAlertsAction,
  validateNewPetitionerAction,
  {
    invalid: [],
    valid: [
      createNewPetitionerUserAction,
      {
        error: [setAlertErrorAction],
        success: showProgressSequenceDecorator([
          createConfirmLinkAction,
          setAlertSuccessAction,
          clearFormAction,
          setNewAccountEmailInStateAction,
          navigateToVerificationSentAction,
        ]),
        warning: [setAlertWarningAction],
      },
    ],
  },
];
