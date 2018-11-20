import { set, toggle } from 'cerebral/factories';
import { state, props } from 'cerebral';

import clearAlerts from './actions/clearAlerts';
import clearLoginForm from './actions/clearLoginForm';
import clearPetition from './actions/clearPetition';
import createCase from './actions/createCase';
import getCase from './actions/getCase';
import getCasesByUser from './actions/getCasesByUser';
import getCasesNew from './actions/getCasesNew';
import getCreateCaseAlertSuccess from './actions/getCreateCaseAlertSuccess';
import getUser from './actions/getUser';
import getUserRole from './actions/getUserRole';
import navigateToDashboard from './actions/navigateToDashboard';
import setAlertError from './actions/setAlertError';
import setAlertSuccess from './actions/setAlertSuccess';
import setBaseUrl from './actions/setBaseUrl';
import setCase from './actions/setCase';
import setCases from './actions/setCases';
import setFormSubmitting from './actions/setFormSubmitting';
import setUser from './actions/setUser';
import toggleDocumentValidationAction from './actions/toggleDocumentValidation';
import unsetFormSubmitting from './actions/unsetFormSubmitting';
import updateCaseAction from './actions/updateCase';
import uploadCasePdfs from './actions/uploadCasePdfs';

export const gotoDashboard = [
  getUserRole,
  {
    taxpayer: [
      getCasesByUser,
      {
        error: [setAlertError],
        success: [setCases],
      },
      set(state`currentPage`, 'Dashboard'),
    ],
    petitionsclerk: [
      getCasesNew,
      {
        error: [setAlertError],
        success: [setCases],
      },
      set(state`currentPage`, 'PetitionsWorkQueue'),
    ],
  },
];
export const gotoLogIn = [
  clearAlerts,
  clearLoginForm,
  set(state`currentPage`, 'LogIn'),
];
export const gotoFilePetition = [
  clearAlerts,
  clearPetition,
  set(state`currentPage`, 'FilePetition'),
];
export const gotoStyleGuide = [set(state`currentPage`, 'StyleGuide')];

export const toggleUsaBannerDetails = [toggle(state`usaBanner.showDetails`)];

export const togglePaymentDetails = [toggle(state`paymentInfo.showDetails`)];

export const updateFormValue = [set(state`form.${props`key`}`, props`value`)];

export const submitLogIn = [
  setFormSubmitting,
  getUser,
  {
    error: [setAlertError],
    success: [setUser, clearAlerts, navigateToDashboard],
  },
  unsetFormSubmitting,
];

export const gotoCaseDetail = [
  setBaseUrl,
  clearAlerts,
  getCase,
  setCase,
  getUserRole,
  {
    taxpayer: [set(state`currentPage`, 'CaseDetail')],
    petitionsclerk: [set(state`currentPage`, 'ValidateCase')],
  },
];

export const updatePetitionValue = [
  set(state`petition.${props`key`}`, props`value`),
];

export const submitFilePetition = [
  setFormSubmitting,
  uploadCasePdfs,
  createCase,
  unsetFormSubmitting,
  getCreateCaseAlertSuccess,
  setAlertSuccess,
  navigateToDashboard,
];

export const toggleDocumentValidation = [toggleDocumentValidationAction];

export const updateCase = [
  clearAlerts,
  updateCaseAction,
  {
    error: [setAlertError],
    success: [setAlertSuccess, navigateToDashboard],
  },
];
