import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';

export const updateCurrentTabSequence = [set(state.currentTab, props.value)];
