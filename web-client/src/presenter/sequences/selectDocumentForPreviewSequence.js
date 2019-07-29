import { props, state } from 'cerebral';
import { selectDocumentForPreviewAction } from '../actions/selectDocumentForPreviewAction';
import { set } from 'cerebral/factories';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';

export const selectDocumentForPreviewSequence = [
  set(state.documentSelectedForPreview, props.documentName),
  selectDocumentForPreviewAction,
  ...setPdfPreviewUrlSequence,
];
