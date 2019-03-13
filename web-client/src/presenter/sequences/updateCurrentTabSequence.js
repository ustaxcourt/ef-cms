import { set } from 'cerebral/factories';
import { props, state } from 'cerebral';

export const updateCurrentTabSequence = [set(state.currentTab, props.value)];
