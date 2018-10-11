import { set } from 'cerebral/factories';
import { state, props } from 'cerebral';
import * as actions from './actions';

export const getHello = [
  actions.getHello,
  set(state`response`, props.response),
];
export const getTrivia = [
  actions.getTrivia,
  set(state`response`, props.response),
];
