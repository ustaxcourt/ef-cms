import { setFormValueAction } from '../actions/setFormValueAction';
import { updateOrderForFilingFeeAction } from '../actions/StartCaseInternal/updateOrderForFilingFeeAction';

export const updatePetitionPaymentFormValueSequence = [
  setFormValueAction,
  updateOrderForFilingFeeAction,
] as unknown as (props: {
  allowEmptyString?: boolean;
  index?: number;
  key: string;
  value: any;
}) => void;
