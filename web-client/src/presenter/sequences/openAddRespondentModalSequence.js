import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getRespondentsBySearchKeyAction } from '../actions/ManualAssociation/getRespondentsBySearchKeyAction';
import { isRespondentInCaseAction } from '../actions/isRespondentInCaseAction';
import { setDefaultServiceIndicatorAction } from '../actions/setDefaultServiceIndicatorAction';
import { setRespondentsAction } from '../actions/ManualAssociation/setRespondentsAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const openAddRespondentModalSequence = [
  clearAlertsAction,
  clearModalStateAction,
  setWaitingForResponseAction,
  setDefaultServiceIndicatorAction('modal'),
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
  unsetWaitingForResponseAction,
];
