import { copyPrimaryContactSequence } from './copyPrimaryContactSequence';
import { setFormValueAction } from '../actions/setFormValueAction';

export const updateContactSecondaryOnChangeSequence = [
  setFormValueAction,
  copyPrimaryContactSequence,
];
