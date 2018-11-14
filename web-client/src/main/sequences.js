import { set, toggle } from 'cerebral/factories';
import { state, props } from 'cerebral';
import * as actions from './actions';

export const gotoDashboard = [
  actions.getCaseList,
  {
    error: [actions.setAlertError],
    success: [actions.setCaseList],
  },
  set(state`currentPage`, 'Dashboard'),
];
export const gotoLogIn = [
  actions.clearLoginForm,
  set(state`currentPage`, 'LogIn'),
];
export const gotoFilePetition = [
  actions.clearAlertError,
  actions.clearPetition,
  set(state`currentPage`, 'FilePetition'),
];
export const gotoStyleGuide = [set(state`currentPage`, 'StyleGuide')];

export const toggleUsaBannerDetails = [toggle(state`usaBanner.showDetails`)];

export const togglePaymentDetails = [toggle(state`paymentInfo.showDetails`)];

export const updateFormValue = [set(state`form.${props`key`}`, props`value`)];

export const submitLogIn = [
  actions.setFormSubmitting,
  actions.getUser,
  {
    error: [actions.setAlertError],
    success: [actions.setUser, actions.navigateToDashboard],
  },
  actions.unsetFormSubmitting,
];

export const gotoCaseDetail = [
  actions.setBaseUrl,
  actions.getCaseDetail,
  actions.setCaseDetail,
  set(state`currentPage`, 'CaseDetail'),
];

export const updatePetitionValue = [
  set(state`petition.${props`key`}`, props`value`),
];

export const submitFilePetition = [
  actions.setFormSubmitting,
  actions.createCase,
  actions.unsetFormSubmitting,
  actions.getCreateCaseAlertSuccess,
  actions.setAlertSuccess,
  actions.navigateToDashboard,
];
