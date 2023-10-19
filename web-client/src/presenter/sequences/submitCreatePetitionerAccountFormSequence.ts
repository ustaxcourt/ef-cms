import { clearFormAction } from '@web-client/presenter/actions/clearFormAction';
import { createPetitionerAccountFormAction } from '@web-client/presenter/actions/createPetitionerAccountFormAction';
import { navigateToVerificationSentAction } from '@web-client/presenter/actions/navigateToVerificationSentAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setNewAccountEmailInStateAction } from '@web-client/presenter/actions/setNewAccountEmailInStateAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const submitCreatePetitionerAccountFormSequence = [
  createPetitionerAccountFormAction,
  {
    error: [setAlertErrorAction],
    success: showProgressSequenceDecorator([
      clearFormAction,
      setNewAccountEmailInStateAction,
      navigateToVerificationSentAction,
    ]),
  },
];
