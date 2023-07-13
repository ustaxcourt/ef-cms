import { chooseStartCaseWizardStepAction } from '../actions/chooseStartCaseWizardStepAction';
import { clearConfirmationTextStatisticsAction } from '../actions/clearConfirmationTextStatisticsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getConstants } from '../../getConstants';
import { prepareFormAction } from '../actions/StartCase/prepareFormAction';
import { runPathForUserRoleAction } from '../actions/runPathForUserRoleAction';
import { setDefaultStartCaseInternalFormAction } from '../actions/StartCaseInternal/setDefaultStartCaseInternalFormAction';
import { setDocumentSelectedForScanAction } from '../actions/setDocumentSelectedForScanAction';
import { setDocumentUploadModeAction } from '../actions/setDocumentUploadModeAction';
import { setStartInternalCaseDefaultTabAction } from '../actions/StartCaseInternal/setStartInternalCaseDefaultTabAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { takePathForRoles } from './takePathForRoles';

const { USER_ROLES } = getConstants();

const gotoStartCaseInternal = [
  setStartInternalCaseDefaultTabAction,
  setDefaultStartCaseInternalFormAction,
  setDocumentUploadModeAction('scan'),
  setDocumentSelectedForScanAction('petitionFile'),
  setupCurrentPageAction('StartCaseInternal'),
];

const gotoStartCaseExternal = [
  chooseStartCaseWizardStepAction,
  setupCurrentPageAction('StartCaseWizard'),
];

export const gotoStartCaseWizardSequence =
  startWebSocketConnectionSequenceDecorator([
    clearFormAction,
    clearConfirmationTextStatisticsAction,
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
