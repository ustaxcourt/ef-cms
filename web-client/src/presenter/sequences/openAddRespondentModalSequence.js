import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getRespondentsBySearchKeyAction } from '../actions/ManualAssociation/getRespondentsBySearchKeyAction';
import { isRespondentInCaseAction } from '../actions/isRespondentInCaseAction';
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
    success: [
      setRespondentsAction,
      isRespondentInCaseAction,
      {
        no: [set(state.showModal, 'AddRespondentModal')],
        yes: [set(state.showModal, 'RespondentExistsModal')],
      },
    ],
  },
];
