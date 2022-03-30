import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getCaseAssociationAction } from '../actions/getCaseAssociationAction';
import { getCaseDeadlinesForCaseAction } from '../actions/CaseDeadline/getCaseDeadlinesForCaseAction';
import { getConsolidatedCasesByCaseAction } from '../actions/CaseConsolidation/getConsolidatedCasesByCaseAction';
import { getConstants } from '../../getConstants';
import { getJudgeForCurrentUserAction } from '../actions/getJudgeForCurrentUserAction';
import { getJudgesCaseNoteForCaseAction } from '../actions/TrialSession/getJudgesCaseNoteForCaseAction';
import { getMessagesForCaseAction } from '../actions/CaseDetail/getMessagesForCaseAction';
import { getNotificationsAction } from '../actions/getNotificationsAction';
import { getPendingEmailsOnCaseAction } from '../actions/getPendingEmailsOnCaseAction';
import { getTrialSessionsOnCaseAction } from '../actions/TrialSession/getTrialSessionsOnCaseAction';
import { parallel } from 'cerebral/factories';
import { resetHeaderAccordionsSequence } from './resetHeaderAccordionsSequence';
import { runPathForUserRoleAction } from '../actions/runPathForUserRoleAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseAssociationAction } from '../actions/setCaseAssociationAction';
import { setCaseDetailPageTabUnfrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabUnfrozenAction';
import { setConsolidatedCasesForCaseAction } from '../actions/CaseConsolidation/setConsolidatedCasesForCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultCaseDetailTabAction } from '../actions/setDefaultCaseDetailTabAction';
import { setDefaultDocketRecordSortAction } from '../actions/DocketRecord/setDefaultDocketRecordSortAction';
import { setDefaultEditDocumentEntryPointAction } from '../actions/setDefaultEditDocumentEntryPointAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setIsPrimaryTabAction } from '../actions/setIsPrimaryTabAction';
import { setJudgeUserAction } from '../actions/setJudgeUserAction';
import { setJudgesCaseNoteOnCaseDetailAction } from '../actions/TrialSession/setJudgesCaseNoteOnCaseDetailAction';
import { setNotificationsAction } from '../actions/setNotificationsAction';
import { setPendingEmailsOnCaseAction } from '../actions/setPendingEmailsOnCaseAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { showModalFromQueryAction } from '../actions/showModalFromQueryAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { takePathForRoles } from './takePathForRoles';

const { USER_ROLES } = getConstants();

const gotoCaseDetailInternal = startWebSocketConnectionSequenceDecorator([
  resetHeaderAccordionsSequence,
  setDocketEntryIdAction,
  showModalFromQueryAction,
  parallel([
    [getTrialSessionsOnCaseAction, setTrialSessionsAction],
    [
      getJudgeForCurrentUserAction,
      setJudgeUserAction,
      getNotificationsAction,
      setNotificationsAction,
    ],
    [getCaseDeadlinesForCaseAction],
    [getMessagesForCaseAction],
    [getPendingEmailsOnCaseAction, setPendingEmailsOnCaseAction],
  ]),
  setCurrentPageAction('CaseDetailInternal'),
]);

const gotoCaseDetailExternal = startWebSocketConnectionSequenceDecorator([
  getCaseAssociationAction,
  setCaseAssociationAction,
  setCurrentPageAction('CaseDetail'),
]);

const gotoCaseDetailExternalPractitioners =
  startWebSocketConnectionSequenceDecorator([
    getCaseAssociationAction,
    setCaseAssociationAction,
    getPendingEmailsOnCaseAction,
    setPendingEmailsOnCaseAction,
    setCurrentPageAction('CaseDetail'),
  ]);

const gotoCaseDetailInternalWithNotes =
  startWebSocketConnectionSequenceDecorator([
    setDocketEntryIdAction,
    getJudgesCaseNoteForCaseAction,
    setJudgesCaseNoteOnCaseDetailAction,
    gotoCaseDetailInternal,
  ]);

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
  setDefaultEditDocumentEntryPointAction,
  runPathForUserRoleAction,
  {
    ...takePathForRoles(
      [
        USER_ROLES.adc,
        USER_ROLES.admissionsClerk,
        USER_ROLES.chambers,
        USER_ROLES.clerkOfCourt,
        USER_ROLES.docketClerk,
        USER_ROLES.floater,
        USER_ROLES.general,
        USER_ROLES.petitionsClerk,
        USER_ROLES.reportersOffice,
        USER_ROLES.trialClerk,
      ],
      [gotoCaseDetailInternal],
    ),
    ...takePathForRoles(
      [USER_ROLES.petitioner, USER_ROLES.irsSuperuser],
      gotoCaseDetailExternal,
    ),
    ...takePathForRoles(
      [USER_ROLES.privatePractitioner, USER_ROLES.irsPractitioner],
      gotoCaseDetailExternalPractitioners,
    ),
    chambers: gotoCaseDetailInternalWithNotes,
    judge: gotoCaseDetailInternalWithNotes,
  },
  setCaseDetailPageTabUnfrozenAction,
];
