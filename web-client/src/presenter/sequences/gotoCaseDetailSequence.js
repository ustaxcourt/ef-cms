import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { fetchUserNotificationsSequence } from './fetchUserNotificationsSequence';
import { getCaseAction } from '../actions/getCaseAction';
import { getCaseAssociationAction } from '../actions/getCaseAssociationAction';
import { getCaseDeadlinesForCaseAction } from '../actions/CaseDeadline/getCaseDeadlinesForCaseAction';
import { getCaseMessagesForCaseAction } from '../actions/CaseDetail/getCaseMessagesForCaseAction';
import { getConsolidatedCasesByCaseAction } from '../actions/caseConsolidation/getConsolidatedCasesByCaseAction';
import { getConstants } from '../../getConstants';
import { getDefaultDocketViewerDocumentToDisplayAction } from '../actions/getDefaultDocketViewerDocumentToDisplayAction';
import { getDefaultDraftViewerDocumentToDisplayAction } from '../actions/getDefaultDraftViewerDocumentToDisplayAction';
import { getJudgesCaseNoteForCaseAction } from '../actions/TrialSession/getJudgesCaseNoteForCaseAction';
import { parallel, set } from 'cerebral/factories';
import { runPathForUserRoleAction } from '../actions/runPathForUserRoleAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseAssociationAction } from '../actions/setCaseAssociationAction';
import { setCaseDetailPageTabUnfrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabUnfrozenAction';
import { setConsolidatedCasesForCaseAction } from '../actions/caseConsolidation/setConsolidatedCasesForCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultCaseDetailTabAction } from '../actions/setDefaultCaseDetailTabAction';
import { setDefaultDocketRecordSortAction } from '../actions/DocketRecord/setDefaultDocketRecordSortAction';
import { setIsPrimaryTabAction } from '../actions/setIsPrimaryTabAction';
import { setJudgesCaseNoteOnCaseDetailAction } from '../actions/TrialSession/setJudgesCaseNoteOnCaseDetailAction';
import { setViewerDocumentToDisplayAction } from '../actions/setViewerDocumentToDisplayAction';
import { setViewerDraftDocumentToDisplayAction } from '../actions/setViewerDraftDocumentToDisplayAction';
import { showModalFromQueryAction } from '../actions/showModalFromQueryAction';
import { state } from 'cerebral';
import { takePathForRoles } from './takePathForRoles';

const { USER_ROLES } = getConstants();

const gotoCaseDetailInternal = [
  showModalFromQueryAction,
  getDefaultDocketViewerDocumentToDisplayAction,
  getDefaultDraftViewerDocumentToDisplayAction,
  setViewerDocumentToDisplayAction,
  setViewerDraftDocumentToDisplayAction,
  getCaseDeadlinesForCaseAction,
  getCaseMessagesForCaseAction,
  setCurrentPageAction('CaseDetailInternal'),
];

const gotoCaseDetailExternal = [
  getCaseAssociationAction,
  setCaseAssociationAction,
  setCurrentPageAction('CaseDetail'),
];

const gotoCaseDetailInternalWithNotes = [
  getJudgesCaseNoteForCaseAction,
  setJudgesCaseNoteOnCaseDetailAction,
  gotoCaseDetailInternal,
];

export const gotoCaseDetailSequence = [
  setCurrentPageAction('Interstitial'),
  clearScreenMetadataAction,
  clearFormAction,
  closeMobileMenuAction,
  setDefaultCaseDetailTabAction,
  setIsPrimaryTabAction,
  getCaseAction,
  setCaseAction,
  getConsolidatedCasesByCaseAction,
  setConsolidatedCasesForCaseAction,
  setDefaultDocketRecordSortAction,
  set(state.editDocumentEntryPoint, 'CaseDetail'),
  runPathForUserRoleAction,
  {
    ...takePathForRoles(
      [
        USER_ROLES.adc,
        USER_ROLES.admissionsClerk,
        USER_ROLES.clerkOfCourt,
        USER_ROLES.docketClerk,
        USER_ROLES.petitionsClerk,
        USER_ROLES.trialClerk,
      ],
      [parallel([gotoCaseDetailInternal, fetchUserNotificationsSequence])],
    ),
    ...takePathForRoles(
      [
        USER_ROLES.petitioner,
        USER_ROLES.privatePractitioner,
        USER_ROLES.irsPractitioner,
        USER_ROLES.irsSuperuser,
      ],
      gotoCaseDetailExternal,
    ),
    chambers: gotoCaseDetailInternalWithNotes,
    judge: gotoCaseDetailInternalWithNotes,
  },
  setCaseDetailPageTabUnfrozenAction,
];
