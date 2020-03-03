import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getPractitionersBySearchKeyAction } from '../actions/ManualAssociation/getPractitionersBySearchKeyAction';
import { isPractitionerInCaseAction } from '../actions/isPractitionerInCaseAction';
import { setDefaultServiceIndicatorAction } from '../actions/setDefaultServiceIndicatorAction';
import { setPractitionersAction } from '../actions/ManualAssociation/setPractitionersAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const openAddPractitionerModalSequence = showProgressSequenceDecorator([
  clearAlertsAction,
  clearModalStateAction,
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
]);
