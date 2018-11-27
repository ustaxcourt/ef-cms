import { set } from 'cerebral/factories';
import { state, props } from 'cerebral';

export const updatePetitionValue = [
  set(state`petition.${props`key`}`, props`value`),
];
