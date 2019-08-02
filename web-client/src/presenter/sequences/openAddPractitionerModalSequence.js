import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getPractitionersBySearchKeyAction } from '../actions/ManualAssociation/getPractitionersBySearchKeyAction';
import { set } from 'cerebral/factories';
import { setPractitionersAction } from '../actions/ManualAssociation/setPractitionersAction';
import { state } from 'cerebral';

export const openAddPractitionerModalSequence = [
  clearAlertsAction,
  getPractitionersBySearchKeyAction,
  setPractitionersAction,
  set(state.showModal, 'AddPractitionerModal'),
];
