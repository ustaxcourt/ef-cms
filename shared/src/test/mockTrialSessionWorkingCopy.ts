import { RawTrialSessionWorkingCopy } from '../business/entities/trialSessions/TrialSessionWorkingCopy';

export const MOCK_TRIAL_SESSION_WORKING_COPY: RawTrialSessionWorkingCopy = {
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
  sessionNotes: 'Here ye, here ye I call this trial to order.',
  sort: 'practitioner',
  sortOrder: 'desc',
  trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
};
