import { getInternalCaseCaptionAction } from '../actions/StartCaseInternal/getInternalCaseCaptionAction';
import { getStartCaseInternalTabAction } from '../actions/StartCaseInternal/getStartCaseInternalTabAction';
import { setInternalCaseCaptionAction } from '../actions/StartCaseInternal/setInternalCaseCaptionAction';

export const generateInternalCaseCaptionSequence = [
  getStartCaseInternalTabAction,
  {
    caseInfo: [getInternalCaseCaptionAction, setInternalCaseCaptionAction],
  },
];
