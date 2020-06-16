import { setFormValueAction } from '../actions/setFormValueAction';
import { updateOrderForFilingFeeAction } from '../actions/StartCaseInternal/updateOrderForFilingFeeAction';

export const updatePetitionPaymentFormValueSequence = [
  setFormValueAction,
  updateOrderForFilingFeeAction,
];
