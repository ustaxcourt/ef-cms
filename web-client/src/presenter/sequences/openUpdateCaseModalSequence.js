import { defaultCaseCaptionAction } from '../actions/defaultCaseCaptionAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openUpdateCaseModalSequence = [
  defaultCaseCaptionAction,
  setShowModalFactoryAction('UpdateCaseModalDialog'),
];
