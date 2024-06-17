import { clearAddressFieldsAction } from '@web-client/presenter/actions/clearAddressFieldsAction';
import { clearValidationMessageAction } from '@web-client/presenter/actions/clearValidationMessageAction';
import { setFormValueAction } from '../actions/setFormValueAction';

export const updateFormValueCountryTypeSequence = [
  clearValidationMessageAction,
  clearAddressFieldsAction,
  setFormValueAction,
];
