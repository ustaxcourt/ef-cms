import { set } from 'cerebral/factories';
import { state, props } from 'cerebral';

export const updateSearchTerm = [set(state`searchTerm`, props`searchTerm`)];
