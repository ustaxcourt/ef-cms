import { set } from 'cerebral/factories';
import { state, props } from 'cerebral';

export default [set(state`document.${props`key`}`, props`value`)];
