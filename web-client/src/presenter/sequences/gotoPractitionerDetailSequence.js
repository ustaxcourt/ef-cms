import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { getPractitionerDetailAction } from '../actions/getPractitionerDetailAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPractitionerDetailAction } from '../actions/setPractitionerDetailAction';

export const gotoPractitionerDetailSequence = [
  // TODO: check logged in ?
  setCurrentPageAction('Interstitial'),
  clearErrorAlertsAction,
  getPractitionerDetailAction,
  setPractitionerDetailAction,
  setCurrentPageAction('PractitionerDetail'),
];
