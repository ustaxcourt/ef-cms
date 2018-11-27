import { set } from 'cerebral/factories';
import { state, props } from 'cerebral';

import navigateToCaseDetail from '../actions/navigateToCaseDetail';

export const submitSearch = [
  set(props`caseId`, state`searchTerm`),
  navigateToCaseDetail,
];
