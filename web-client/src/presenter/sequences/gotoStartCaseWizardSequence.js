import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getConstants } from '../../getConstants';
import { prepareFormAction } from '../actions/StartCase/prepareFormAction';
import { props, state } from 'cerebral';
import { runPathForUserRoleAction } from '../actions/runPathForUserRoleAction';
import { set } from 'cerebral/factories';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultStartCaseInternalFormAction } from '../actions/StartCaseInternal/setDefaultStartCaseInternalFormAction';
import { setDocumentUploadModeAction } from '../actions/setDocumentUploadModeAction';
import { setStartInternalCaseDefaultTabAction } from '../actions/StartCaseInternal/setStartInternalCaseDefaultTabAction';
import { setWizardStepAction } from '../actions/setWizardStepAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { takePathForRoles } from './takePathForRoles';

const { USER_ROLES } = getConstants();

const gotoStartCaseInternal = [
  setStartInternalCaseDefaultTabAction,
  setDefaultStartCaseInternalFormAction,
  setDocumentUploadModeAction('scan'),
  set(state.currentViewMetadata.documentSelectedForScan, 'petitionFile'),
  setCurrentPageAction('StartCaseInternal'),
];

const gotoStartCaseExternal = [
  setWizardStepAction(props.wizardStep),
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
