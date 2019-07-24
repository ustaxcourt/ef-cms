import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const updateSessionMetadataSequence = [
  set(state.sessionMetadata[props.key], props.value),
];
