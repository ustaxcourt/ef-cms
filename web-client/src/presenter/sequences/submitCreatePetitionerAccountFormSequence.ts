import { setValidationErrorsAction } from '@web-client/presenter/actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { validateCreatePetitionerAccountFormAction } from '@web-client/presenter/actions/validateCreatePetitionerAccountFormAction';

export const submitCreatePetitionerAccountFormSequence = [
  validateCreatePetitionerAccountFormAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([]),
  },
];
