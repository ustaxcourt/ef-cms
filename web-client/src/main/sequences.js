import { set, toggle } from 'cerebral/factories';
import { state, props } from 'cerebral';
import * as actions from './actions';

export const gotoHome = [set(state`currentPage`, 'Home')];
export const gotoLogIn = [
  actions.clearLoginForm,
  set(state`currentPage`, 'LogIn'),
];
export const gotoFilePetition = [
  actions.clearPetition,
  set(state`currentPage`, 'FilePetition'),
];
export const gotoStyleGuide = [set(state`currentPage`, 'StyleGuide')];

export const toggleUsaBannerDetails = [toggle(state`usaBanner.showDetails`)];

export const updateFormValue = [set(state`form.${props`key`}`, props`value`)];

export const submitLogIn = [
  actions.setFormSubmitting,
  actions.getUser,
  {
    success: [actions.setUser, actions.navigateHome],
    error: [actions.setAlertError],
  },
  actions.unsetFormSubmitting,
];

export const updatePetitionValue = [
  set(state`petition.${props`key`}.file`, props`file`),
];

export const submitFilePetition = [
  actions.setFormSubmitting,
  actions.filePdfPetition,
  actions.unsetFormSubmitting,
  actions.getFilePdfPetitionAlertSuccess,
  actions.setAlertSuccess,
  actions.navigateHome,
];
