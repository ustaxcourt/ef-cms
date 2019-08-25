import { downloadBatchOfTrialSessionAction } from '../actions/TrialSession/downloadBatchOfTrialSessionAction';
import { getCalendaredCasesForTrialSessionAction } from '../actions/TrialSession/getCalendaredCasesForTrialSessionAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getCaseDeadlinesForCaseAction } from '../actions/CaseDeadline/getCaseDeadlinesForCaseAction';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { hasAnotherCalendaredCaseAction } from '../actions/TrialSession/hasAnotherCalendaredCaseAction';
import { isTrialSessionCalendaredAction } from '../actions/TrialSession/isTrialSessionCalendaredAction';
import { printDocketRecordAction } from '../actions/printDocketRecordAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDefaultDocketRecordSortAction } from '../actions/DocketRecord/setDefaultDocketRecordSortAction';
import { stashDocketRecordHtmlAction } from '../actions/TrialSession/stashDocketRecordHtmlAction';

let sequenceHead, sequenceNode, sequenceYes;

sequenceHead = sequenceNode = [];

// TODO Fix to have docket record generation server side then remove this.
for (let i = 0; i < 1000; i++) {
  sequenceYes = [
    getCaseAction,
    setCaseAction,
    getCaseDeadlinesForCaseAction,
    setDefaultDocketRecordSortAction,
    printDocketRecordAction,
    stashDocketRecordHtmlAction,
  ];
  sequenceNode.push(hasAnotherCalendaredCaseAction);
  sequenceNode.push({
    no: [],
    yes: sequenceYes,
  });
  sequenceNode = sequenceYes;
}

export const downloadBatchOfTrialSessionSequence = [
  getTrialSessionDetailsAction,
  isTrialSessionCalendaredAction,
  {
    no: [],
    yes: [getCalendaredCasesForTrialSessionAction],
  },
  ...sequenceHead,
  downloadBatchOfTrialSessionAction,
];
