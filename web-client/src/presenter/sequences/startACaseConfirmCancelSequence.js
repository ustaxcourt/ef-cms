import { toggle } from 'cerebral/factories';
import { state } from 'cerebral';
import navigateToDashboardAction from '../actions/navigateToDashboardAction';

export default [toggle(state.showModal), navigateToDashboardAction];
