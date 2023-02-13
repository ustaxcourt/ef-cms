import { clearAllDocumentsAccordionAction } from '../actions/clearAllDocumentsAccordionAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { navigateToViewAllDocumentsAction } from '../actions/FileDocument/navigateToViewAllDocumentsAction';

export const gotoViewAllDocumentsSequence = [
  clearFormAction,
  clearModalAction,
  clearModalStateAction,
  clearScreenMetadataAction,
  clearAllDocumentsAccordionAction,
  navigateToViewAllDocumentsAction,
];
