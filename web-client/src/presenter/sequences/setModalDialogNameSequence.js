import { set } from 'cerebral/factories';
import { props, state } from 'cerebral';

export default [set(state.showModal, props.showModal)];
