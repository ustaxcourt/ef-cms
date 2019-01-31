import { set } from 'cerebral/factories';
import { state } from 'cerebral';
import navigateToDashboardAction from '../actions/navigateToDashboardAction';

export default [set(state.showModal, ''), navigateToDashboardAction];
