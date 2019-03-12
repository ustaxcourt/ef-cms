import { set } from 'cerebral/factories';
import { state } from 'cerebral';
import { defaultCaseCaptionAction } from '../actions/defaultCaseCaptionAction';

export const openCaseCaptionModalSequence = [
  defaultCaseCaptionAction,
  set(state.showModal, 'CaseCaptionModal'),
];
