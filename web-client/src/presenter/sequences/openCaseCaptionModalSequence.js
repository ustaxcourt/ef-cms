import { defaultCaseCaptionAction } from '../actions/defaultCaseCaptionAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const openCaseCaptionModalSequence = [
  defaultCaseCaptionAction,
  set(state.showModal, 'UpdateCaseCaptionModalDialog'),
];
