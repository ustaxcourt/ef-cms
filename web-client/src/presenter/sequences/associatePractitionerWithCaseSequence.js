import { associatePractitionerWithCaseAction } from '../actions/ManualAssociation/associatePractitionerWithCaseAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';

export const associatePractitionerWithCaseSequence = [
  associatePractitionerWithCaseAction,
  clearModalAction,
  clearModalStateAction,
];
