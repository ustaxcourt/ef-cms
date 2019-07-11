import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { navigateToViewAllDocumentsAction } from '../actions/FileDocument/navigateToViewAllDocumentsAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const gotoViewAllDocumentsSequence = [
  clearAlertsAction,
  clearFormAction,
  clearModalAction,
  clearModalStateAction,
  set(state.allDocumentsAccordion, ''),
  navigateToViewAllDocumentsAction,
];
