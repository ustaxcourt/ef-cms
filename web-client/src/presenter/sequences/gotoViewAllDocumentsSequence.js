import { navigateToViewAllDocumentsAction } from '../actions/FileDocument/navigateToViewAllDocumentsAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const gotoViewAllDocumentsSequence = [
  set(state.allDocumentsAccordion, ''),
  navigateToViewAllDocumentsAction,
];
