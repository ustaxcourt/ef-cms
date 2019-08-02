import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getPractitionersBySearchKeyAction } from '../actions/ManualAssociation/getPractitionersBySearchKeyAction';
import { set } from 'cerebral/factories';
import { setPractitionersAction } from '../actions/ManualAssociation/setPractitionersAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { state } from 'cerebral';

export const openAddPractitionerModalSequence = [
  clearAlertsAction,
  getPractitionersBySearchKeyAction,
  {
    error: [setValidationErrorsAction],
    success: [
      setPractitionersAction,
      set(state.showModal, 'AddPractitionerModal'),
    ],
  },
];
