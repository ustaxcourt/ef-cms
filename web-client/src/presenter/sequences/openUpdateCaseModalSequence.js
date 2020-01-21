import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { defaultUpdateCaseModalValuesAction } from '../actions/defaultUpdateCaseModalValuesAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setUsersByKeyAction } from '../actions/setUsersByKeyAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const openUpdateCaseModalSequence = [
  stopShowValidationAction,
  setWaitingForResponseAction,
  clearFormAction,
  clearAlertsAction,
  defaultUpdateCaseModalValuesAction,
  getUsersInSectionAction({ section: 'judge' }),
  setUsersByKeyAction('modal.judgeUsers'),
  unsetWaitingForResponseAction,
  setShowModalFactoryAction('UpdateCaseModalDialog'),
];
