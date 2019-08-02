import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getRespondentsBySearchKeyAction } from '../actions/ManualAssociation/getRespondentsBySearchKeyAction';
import { set } from 'cerebral/factories';
import { setRespondentsAction } from '../actions/ManualAssociation/setRespondentsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { state } from 'cerebral';

export const openAddRespondentModalSequence = [
  clearAlertsAction,
  getRespondentsBySearchKeyAction,
  {
    error: [setValidationErrorsAction],
    success: [setRespondentsAction, set(state.showModal, 'AddRespondentModal')],
  },
];
