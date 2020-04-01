import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { prepareFormAction } from '../actions/StartCase/prepareFormAction';
import { props, state } from 'cerebral';
import { runPathForUserRoleAction } from '../actions/runPathForUserRoleAction';
import { set } from 'cerebral/factories';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setStartInternalCaseDefaultTabAction } from '../actions/StartCaseInternal/setStartInternalCaseDefaultTabAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { takePathForRoles } from './takePathForRoles';
import { updateOrderForDesignatingPlaceOfTrialAction } from '../actions/updateOrderForDesignatingPlaceOfTrialAction';

const gotoStartCaseInternal = [
  setStartInternalCaseDefaultTabAction,
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
        'adc',
        'admissionsclerk',
        'chambers',
        'clerkofcourt',
        'docketclerk',
        'judge',
        'petitionsclerk',
        'trialclerk',
      ],
      gotoStartCaseInternal,
    ),
    ...takePathForRoles(
      ['petitioner', 'privatePractitioner'],
      gotoStartCaseExternal,
    ),
  },
];
