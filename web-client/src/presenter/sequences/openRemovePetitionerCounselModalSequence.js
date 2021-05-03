import { clearModalAction } from '../actions/clearModalAction';
import { defaultUpdateCaseModalValuesAction } from '../actions/defaultUpdateCaseModalValuesAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const openRemovePetitionerCounselModalSequence = [
  stopShowValidationAction,
  clearModalAction,
  defaultUpdateCaseModalValuesAction,
  setShowModalFactoryAction('RemovePetitionerCounselModal'),
];
