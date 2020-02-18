import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getPractitionersBySearchKeyAction } from '../actions/ManualAssociation/getPractitionersBySearchKeyAction';
import { isPractitionerInCaseAction } from '../actions/isPractitionerInCaseAction';
import { setDefaultServiceIndicatorAction } from '../actions/setDefaultServiceIndicatorAction';
import { setPractitionersAction } from '../actions/ManualAssociation/setPractitionersAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const openAddPractitionerModalSequence = [
  clearAlertsAction,
  clearModalStateAction,
  setWaitingForResponseAction,
  setDefaultServiceIndicatorAction('modal'),
  getPractitionersBySearchKeyAction,
  {
    error: [setValidationErrorsAction],
    success: [
      setPractitionersAction,
      isPractitionerInCaseAction,
      {
        no: [setShowModalFactoryAction('AddPractitionerModal')],
        yes: [setShowModalFactoryAction('PractitionerExistsModal')],
      },
    ],
  },
  unsetWaitingForResponseAction,
];
