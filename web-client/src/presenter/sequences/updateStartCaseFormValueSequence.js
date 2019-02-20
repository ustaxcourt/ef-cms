import { set } from 'cerebral/factories';
import { state, props } from 'cerebral';
import updatePartyType from '../actions/updatePartyTypeAction';

export default [set(state.form[props.key], props.value), updatePartyType];
