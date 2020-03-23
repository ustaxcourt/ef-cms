import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const updateCurrentTabSequence = [
  set(state.currentViewMetadata.tab, props.value),
];
