import { set } from 'cerebral/factories';
import { state, props } from 'cerebral';

/**
 * set form.name with provided token (username), same as it would be if
 * we went to /log-in and provided a username
 * to be used in combination with other sequences
 */
export default [set(state.form.name, props.token)];
