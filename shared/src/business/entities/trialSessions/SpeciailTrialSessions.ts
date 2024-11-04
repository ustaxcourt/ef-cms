export interface SpecialTrialSession {
  userId: string;
  trialSessionId: string;
}

export interface SpecialTrialSessionKey {
  pk: string;
  sk: string;
}

export interface TrialSessionWorkingCopyNotes {
  sessionNotes: string;
  trialSessionId: string;
}
