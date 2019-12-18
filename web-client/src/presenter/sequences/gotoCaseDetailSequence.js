import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getCaseAssociationAction } from '../actions/getCaseAssociationAction';
import { getCaseDeadlinesForCaseAction } from '../actions/CaseDeadline/getCaseDeadlinesForCaseAction';
import { getCaseNoteForCaseAction } from '../actions/TrialSession/getCaseNoteForCaseAction';
import { getConsolidatedCasesByCaseAction } from '../actions/caseConsolidation/getConsolidatedCasesByCaseAction';
import { runPathForUserRoleAction } from '../actions/runPathForUserRoleAction';
import { set } from 'cerebral/factories';
import { setBaseUrlAction } from '../actions/setBaseUrlAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseAssociationAction } from '../actions/setCaseAssociationAction';
import { setConsolidatedCasesForCaseAction } from '../actions/caseConsolidation/setConsolidatedCasesForCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultCaseDetailTabAction } from '../actions/setDefaultCaseDetailTabAction';
import { setDefaultDocketRecordSortAction } from '../actions/DocketRecord/setDefaultDocketRecordSortAction';
import { setJudgesCaseNoteOnCaseDetailAction } from '../actions/TrialSession/setJudgesCaseNoteOnCaseDetailAction';
import { state } from 'cerebral';
import { takePathForRoles } from './takePathForRoles';

const gotoCaseDetailInternal = [setCurrentPageAction('CaseDetailInternal')];
const gotoCaseDetailExternal = [
  getCaseAssociationAction,
  setCaseAssociationAction,
  setCurrentPageAction('CaseDetail'),
];

const gotoCaseDetailInternalWithNotes = [
  getCaseNoteForCaseAction,
  setJudgesCaseNoteOnCaseDetailAction,
  ...gotoCaseDetailInternal,
];

export const gotoCaseDetailSequence = [
  setCurrentPageAction('Interstitial'),
  clearScreenMetadataAction,
  closeMobileMenuAction,
  setDefaultCaseDetailTabAction,
  getCaseAction,
  setCaseAction,
  getConsolidatedCasesByCaseAction,
  setConsolidatedCasesForCaseAction,
  getCaseDeadlinesForCaseAction,
  setDefaultDocketRecordSortAction,
  setBaseUrlAction,
  set(state.editDocumentEntryPoint, 'CaseDetail'),
  runPathForUserRoleAction,
  {
    ...takePathForRoles(
      [
        'adc',
        'admissionsclerk',
        'calendarclerk',
        'clerkofcourt',
        'docketclerk',
        'petitionsclerk',
        'trialclerk',
      ],
      gotoCaseDetailInternal,
    ),
    ...takePathForRoles(
      ['petitioner', 'practitioner', 'respondent'],
      gotoCaseDetailExternal,
    ),
    chambers: gotoCaseDetailInternalWithNotes,
    judge: gotoCaseDetailInternalWithNotes,
  },
];
