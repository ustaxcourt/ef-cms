import { defaultCaseCaptionAction } from '../actions/defaultCaseCaptionAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openCaseCaptionModalSequence = [
  defaultCaseCaptionAction,
  setShowModalFactoryAction('UpdateCaseCaptionModalDialog'),
];
