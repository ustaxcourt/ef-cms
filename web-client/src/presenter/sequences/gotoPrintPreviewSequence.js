import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { set } from 'cerebral/factories';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setFormSubmittingSequence } from './setFormSubmittingSequence';
import { state } from 'cerebral';
import { unsetFormSubmittingSequence } from './unsetFormSubmittingSequence';

export const gotoPrintPreviewSequence = [
  setCurrentPageAction('Interstitial'),
  clearModalAction,
  clearFormAction,
  clearScreenMetadataAction,
  setFormSubmittingSequence,
  getCaseAction,
  setCaseAction,
  set(state.currentPage, 'PrintPreview'),
  unsetFormSubmittingSequence,
];
