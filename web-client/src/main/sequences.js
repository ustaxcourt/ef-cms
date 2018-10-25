import { set, toggle } from 'cerebral/factories';
import { state, props } from 'cerebral';
import * as actions from './actions';

export const gotoHome = [set(state`currentPage`, 'Home')];
export const gotoLogIn = [set(state`currentPage`, 'LogIn')];
export const gotoFilePetition = [set(state`currentPage`, 'FilePetition')];
export const gotoStyleGuide = [set(state`currentPage`, 'StyleGuide')];

export const toggleUsaBannerDetails = [toggle(state`usaBanner.showDetails`)];

export const updatePetitionValue = [
  set(state`petition.${props`key`}`, props`value`),
  actions.updatePetition,
  set(state`petition`, props.petition),
];

export const submitFilePetition = [
  actions.getDocumentPolicy,
  {
    success: [
      set(state`petition.policy`, props`policy`),
      actions.uploadDocumentToS3,
      // actions.filePetition,
    ],
    error: [set(state`alertError`, props`alertError`)],
  },
];
