import { unsetRedirectUrlAction } from '../actions/unsetRedirectURLAction';
import { dismissModalSequence } from './dismissModalSequence';

export const dismissModalAndClearRedirectSequence = [
  ...dismissModalSequence,
  unsetRedirectUrlAction,
];
