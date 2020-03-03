import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getRespondentsBySearchKeyAction } from '../actions/ManualAssociation/getRespondentsBySearchKeyAction';
import { isRespondentInCaseAction } from '../actions/isRespondentInCaseAction';
import { setDefaultServiceIndicatorAction } from '../actions/setDefaultServiceIndicatorAction';
import { setRespondentsAction } from '../actions/ManualAssociation/setRespondentsAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const openAddRespondentModalSequence = showProgressSequenceDecorator([
  clearAlertsAction,
  clearModalStateAction,
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
]);
