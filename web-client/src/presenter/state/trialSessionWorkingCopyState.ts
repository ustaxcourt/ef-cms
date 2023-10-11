import { RawTrialSessionWorkingCopy } from '@shared/business/entities/trialSessions/TrialSessionWorkingCopy';
import { UserCaseNote } from '@shared/business/entities/notes/UserCaseNote';

export const initialTrialSessionWorkingCopyState: RawTrialSessionWorkingCopy & {
  userNotes: {
    [docketNumber: string]: UserCaseNote;
  };
} = {
  caseMetadata: {},
  entityName: 'TrialSessionWorkingCopy',
  filters: {
    basisReached: true,
    continued: true,
    definiteTrial: true,
    dismissed: true,
    motionToDismiss: true,
    probableSettlement: true,
    probableTrial: true,
    recall: true,
    rule122: true,
    setForTrial: true,
    settled: true,
    showAll: true,
    statusUnassigned: true,
    submittedCAV: true,
  },
  sessionNotes: '',
  sort: 'docket',
  sortOrder: 'asc',
  trialSessionId: '',
  userId: '',
  userNotes: {},
};
