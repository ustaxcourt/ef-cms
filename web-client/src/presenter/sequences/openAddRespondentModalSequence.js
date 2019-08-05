import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getRespondentsBySearchKeyAction } from '../actions/ManualAssociation/getRespondentsBySearchKeyAction';
import { set } from 'cerebral/factories';
import { setRespondentsAction } from '../actions/ManualAssociation/setRespondentsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { state } from 'cerebral';

export const openAddRespondentModalSequence = [
  clearAlertsAction,
  clearModalStateAction,
  getRespondentsBySearchKeyAction,
  {
    error: [setValidationErrorsAction],
    success: [setRespondentsAction, set(state.showModal, 'AddRespondentModal')],
  },
];
