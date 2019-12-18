import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getRespondentsBySearchKeyAction } from '../actions/ManualAssociation/getRespondentsBySearchKeyAction';
import { isRespondentInCaseAction } from '../actions/isRespondentInCaseAction';
import { setRespondentsAction } from '../actions/ManualAssociation/setRespondentsAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';

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
        no: [setShowModalFactoryAction('AddRespondentModal')],
        yes: [setShowModalFactoryAction('RespondentExistsModal')],
      },
    ],
  },
];
