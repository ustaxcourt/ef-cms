import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseTypesAction } from '../actions/getCaseTypesAction';
import { getFilingTypesAction } from '../actions/getFilingTypesAction';
import { getProcedureTypesAction } from '../actions/getProcedureTypesAction';
import { prepareFormAction } from '../actions/StartCase/prepareFormAction';
import { props, state } from 'cerebral';
import { runPathForUserRoleAction } from '../actions/runPathForUserRoleAction';
import { set } from 'cerebral/factories';
import { setCaseTypesAction } from '../actions/setCaseTypesAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setFilingTypesAction } from '../actions/setFilingTypesAction';
import { setProcedureTypesAction } from '../actions/setProcedureTypesAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { takePathForRoles } from './takePathForRoles';

const gotoStartCaseInternal = [
  set(state.documentUploadMode, 'scan'),
  set(state.documentSelectedForScan, 'petitionFile'),
  setCurrentPageAction('StartCaseInternal'),
];

const gotoStartCaseExternal = [
  getFilingTypesAction,
  setFilingTypesAction,
  set(state.wizardStep, props.wizardStep),
  set(state.form.wizardStep, props.step),
  setCurrentPageAction('StartCaseWizard'),
];

export const gotoStartCaseWizardSequence = [
  clearFormAction,
  clearScreenMetadataAction,
  prepareFormAction,
  stopShowValidationAction,
  getCaseTypesAction,
  setCaseTypesAction,
  getProcedureTypesAction,
  setProcedureTypesAction,
  runPathForUserRoleAction,
  {
    ...takePathForRoles(
      [
        'adc',
        'admissionsclerk',
        'calendarclerk',
        'chambers',
        'clerkofcourt',
        'docketclerk',
        'judge',
        'petitionsclerk',
        'trialclerk',
      ],
      gotoStartCaseInternal,
    ),
    ...takePathForRoles(['petitioner', 'practitioner'], gotoStartCaseExternal),
  },
];
