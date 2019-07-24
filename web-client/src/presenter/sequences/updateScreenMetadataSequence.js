import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const updateScreenMetadataSequence = [
  set(state.screenMetadata[props.key], props.value),
];
