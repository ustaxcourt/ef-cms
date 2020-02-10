import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { set } from 'cerebral/factories';
import { setAlertWarningAction } from '../actions/setAlertWarningAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setFormSubmittingSequence } from './setFormSubmittingSequence';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { state } from 'cerebral';

export const gotoPrintPreviewSequence = showProgressSequenceDecorator([
  setCurrentPageAction('Interstitial'),
  clearModalAction,
  clearFormAction,
  clearScreenMetadataAction,
  setFormSubmittingSequence,
  getCaseAction,
  setCaseAction,
  setAlertWarningAction,
  set(state.currentPage, 'PrintPreview'),
]);
