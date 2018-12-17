import { set } from 'cerebral/factories';
import { state, props } from 'cerebral';

import navigateToCaseDetail from '../actions/navigateToCaseDetailAction';

export default [set(props.caseId, state.searchTerm), navigateToCaseDetail];
