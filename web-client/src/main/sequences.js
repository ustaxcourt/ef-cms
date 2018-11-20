import { set, toggle } from 'cerebral/factories';
import { state, props } from 'cerebral';

import clearAlerts from './actions/clearAlerts';
import clearLoginForm from './actions/clearLoginForm';
import clearPetition from './actions/clearPetition';
import createCase from './actions/createCase';
import getCase from './actions/getCase';
import getCaseList from './actions/getCaseList';
import getCreateCaseAlertSuccess from './actions/getCreateCaseAlertSuccess';
import getPetitionsClerkCaseList from './actions/getPetitionsClerkCaseList';
import getUser from './actions/getUser';
import getUserRole from './actions/getUserRole';
import navigateToDashboard from './actions/navigateToDashboard';
import setAlertError from './actions/setAlertError';
import setAlertSuccess from './actions/setAlertSuccess';
import setBaseUrl from './actions/setBaseUrl';
import setCaseDetail from './actions/setCaseDetail';
import setCaseList from './actions/setCaseList';
import setFormSubmitting from './actions/setFormSubmitting';
import setUser from './actions/setUser';
import unsetFormSubmitting from './actions/unsetFormSubmitting';
import updateCaseAction from './actions/updateCase';
import uploadCasePdfs from './actions/uploadCasePdfs';

export const gotoDashboard = [
  getUserRole,
  {
    taxpayer: [
      getCaseList,
      {
        error: [setAlertError],
        success: [setCaseList],
      },
      set(state`currentPage`, 'Dashboard'),
    ],
    petitionsclerk: [
      getPetitionsClerkCaseList,
      {
        error: [setAlertError],
        success: [setCaseList],
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
    success: [setUser, navigateToDashboard],
  },
  unsetFormSubmitting,
];

export const gotoCaseDetail = [
  setBaseUrl,
  clearAlerts,
  getCase,
  setCaseDetail,
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

export const toggleDocumentValidation = [toggleDocumentValidation];

export const updateCase = [
  clearAlerts,
  updateCaseAction,
  {
    error: [setAlertError],
    success: [setAlertSuccess, navigateToDashboard],
  },
];
