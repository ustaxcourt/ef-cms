import { clearModalAction } from '../actions/clearModalAction';
import { navigateToCreateOrderAction } from '../actions/CourtIssuedOrder/navigateToCreateOrderAction';
import { setCasePropFromStateAction } from '../actions/setCasePropFromStateAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { stashCreateOrderModalDataAction } from '../actions/CourtIssuedOrder/stashCreateOrderModalDataAction';

export const submitCreateOrderModalSequence = [
  clearModalAction,
  setCurrentPageAction('Interstitial'),
  stashCreateOrderModalDataAction,
  setCasePropFromStateAction,
  navigateToCreateOrderAction,
];
