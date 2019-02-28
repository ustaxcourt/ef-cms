import { set } from 'cerebral/factories';
import { state, props } from 'cerebral';

export const updateCurrentTabSequence = [set(state.currentTab, props.value)];
