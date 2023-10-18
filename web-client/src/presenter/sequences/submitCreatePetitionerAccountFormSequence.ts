import { createPetitionerAccountFormAction } from '@web-client/presenter/actions/createPetitionerAccountFormAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setNewAccountEmailInStateAction } from '@web-client/presenter/actions/setNewAccountEmailInStateAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const submitCreatePetitionerAccountFormSequence = [
  createPetitionerAccountFormAction,
  {
    error: [setAlertErrorAction],
    success: showProgressSequenceDecorator([
      setNewAccountEmailInStateAction,
      navigateToCheckYourEmailPageAction,
    ]),
  },
];
