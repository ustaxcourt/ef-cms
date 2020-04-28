import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getConstants } from '../../getConstants';
import { prepareFormAction } from '../actions/StartCase/prepareFormAction';
import { props, state } from 'cerebral';
import { runPathForUserRoleAction } from '../actions/runPathForUserRoleAction';
import { set } from 'cerebral/factories';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultStartCaseInternalFormAction } from '../actions/StartCaseInternal/setDefaultStartCaseInternalFormAction';
import { setStartInternalCaseDefaultTabAction } from '../actions/StartCaseInternal/setStartInternalCaseDefaultTabAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { takePathForRoles } from './takePathForRoles';
import { updateOrderForDesignatingPlaceOfTrialAction } from '../actions/updateOrderForDesignatingPlaceOfTrialAction';
const { USER_ROLES } = getConstants();

const gotoStartCaseInternal = [
  setStartInternalCaseDefaultTabAction,
  setDefaultStartCaseInternalFormAction,
  updateOrderForDesignatingPlaceOfTrialAction,
  set(state.currentViewMetadata.documentUploadMode, 'scan'),
  set(state.currentViewMetadata.documentSelectedForScan, 'petitionFile'),
  setCurrentPageAction('StartCaseInternal'),
];

const gotoStartCaseExternal = [
  set(state.wizardStep, props.wizardStep),
  set(state.form.wizardStep, props.step),
  setCurrentPageAction('StartCaseWizard'),
];

export const gotoStartCaseWizardSequence = [
  clearFormAction,
  clearScreenMetadataAction,
  prepareFormAction,
  stopShowValidationAction,
  runPathForUserRoleAction,
  {
    ...takePathForRoles(
      [
        USER_ROLES.adc,
        USER_ROLES.admissionsClerk,
        USER_ROLES.chambers,
        USER_ROLES.clerkOfCourt,
        USER_ROLES.docketClerk,
        USER_ROLES.judge,
        USER_ROLES.petitionsClerk,
        USER_ROLES.trialClerk,
      ],
      gotoStartCaseInternal,
    ),
    ...takePathForRoles(
      [USER_ROLES.petitioner, USER_ROLES.privatePractitioner],
      gotoStartCaseExternal,
    ),
  },
];
