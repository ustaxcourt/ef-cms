import { chooseStartCaseWizardStepAction } from '../actions/chooseStartCaseWizardStepAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getConstants } from '../../getConstants';
import { getFeatureFlagFactoryAction } from '../actions/getFeatureFlagFactoryAction';
import { prepareFormAction } from '../actions/StartCase/prepareFormAction';
import { runPathForUserRoleAction } from '../actions/runPathForUserRoleAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultStartCaseInternalFormAction } from '../actions/StartCaseInternal/setDefaultStartCaseInternalFormAction';
import { setDocumentSelectedForScanAction } from '../actions/setDocumentSelectedForScanAction';
import { setDocumentUploadModeAction } from '../actions/setDocumentUploadModeAction';
import { setFeatureFlagFactoryAction } from '../actions/setFeatureFlagFactoryAction';
import { setStartInternalCaseDefaultTabAction } from '../actions/StartCaseInternal/setStartInternalCaseDefaultTabAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { takePathForRoles } from './takePathForRoles';

const { USER_ROLES } = getConstants();

const gotoStartCaseInternal = [
  getFeatureFlagFactoryAction(
    getConstants().ALLOWLIST_FEATURE_FLAGS.E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG
      .key,
  ),
  setFeatureFlagFactoryAction(
    getConstants().ALLOWLIST_FEATURE_FLAGS.E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG
      .key,
  ),
  setStartInternalCaseDefaultTabAction,
  setDefaultStartCaseInternalFormAction,
  setDocumentUploadModeAction('scan'),
  setDocumentSelectedForScanAction('petitionFile'),
  setCurrentPageAction('StartCaseInternal'),
];

const gotoStartCaseExternal = [
  chooseStartCaseWizardStepAction,
  setCurrentPageAction('StartCaseWizard'),
];

export const gotoStartCaseWizardSequence =
  startWebSocketConnectionSequenceDecorator([
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
          USER_ROLES.caseServicesSupervisor,
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
  ]);
