import { associatePractitionerWithCaseAction } from '../actions/ManualAssociation/associatePractitionerWithCaseAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCasePropFromStateAction } from '../actions/setCasePropFromStateAction';

export const associatePractitionerWithCaseSequence = [
  associatePractitionerWithCaseAction,
  {
    success: [
      setAlertSuccessAction,
      clearModalAction,
      clearModalStateAction,
      setCasePropFromStateAction,
      getCaseAction,
      setCaseAction,
    ],
  },
];
