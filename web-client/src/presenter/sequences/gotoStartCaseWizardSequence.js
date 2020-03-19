import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getProcedureTypesAction } from '../actions/getProcedureTypesAction';
import { prepareFormAction } from '../actions/StartCase/prepareFormAction';
import { props, state } from 'cerebral';
import { runPathForUserRoleAction } from '../actions/runPathForUserRoleAction';
import { set } from 'cerebral/factories';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setProcedureTypesAction } from '../actions/setProcedureTypesAction';
import { setStartInternalCaseDefaultTabAction } from '../actions/StartCaseInternal/setStartInternalCaseDefaultTabAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { takePathForRoles } from './takePathForRoles';
import { updateOrderForDesignatingPlaceOfTrialAction } from '../actions/updateOrderForDesignatingPlaceOfTrialAction';

const gotoStartCaseInternal = [
  setStartInternalCaseDefaultTabAction,
  updateOrderForDesignatingPlaceOfTrialAction,
  set(state.documentUploadMode, 'scan'),
  set(state.documentSelectedForScan, 'petitionFile'),
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
  getProcedureTypesAction,
  setProcedureTypesAction,
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
