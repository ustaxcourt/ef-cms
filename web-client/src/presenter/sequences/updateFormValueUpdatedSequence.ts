import { clearValidationMessageAction } from '@web-client/presenter/actions/clearValidationMessageAction';
import { setFormValueAction } from '../actions/setFormValueAction';

export const updateFormValueUpdatedSequence = [
  clearValidationMessageAction,
  setFormValueAction,
] as unknown as (params: { key: string; value: any; index?: number }) => void;
