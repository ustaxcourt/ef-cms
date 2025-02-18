import { MinuteSheet } from '@shared/business/entities/trialSessionMinutes/MinuteSheet';

export const validateMinuteSheet = (value: unknown): value is MinuteSheet => {
  if (!isNonNullObject(value)) return false;

  return (
    isNonNullObject(value.trialSession) &&
    isNonNullObject(value.caseRecord) &&
    isNonNullObject(value.appearances) &&
    isNonNullObject(value.jurisdiction) &&
    isNonNullObject(value.orders) &&
    isNonNullObject(value.proceedings) &&
    isNonNullObject(value.brief) &&
    isNonNullObject(value.evidence) &&
    hasValidTrialSession(value.trialSession) &&
    hasValidCaseRecord(value.caseRecord) &&
    hasValidAppearances(value.appearances) &&
    hasValidProceedings(value.proceedings) &&
    hasValidEvidence(value.evidence)
  );
};

const isNonNullObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const hasValidTrialSession = (trialSession: Record<string, unknown>): boolean =>
  typeof trialSession.id === 'string' &&
  isNonNullObject(trialSession.judge) &&
  typeof trialSession.trialClerk === 'string' &&
  typeof trialSession.courtReporter === 'string' &&
  typeof trialSession.isRemote === 'boolean';

const hasValidCaseRecord = (caseRecord: Record<string, unknown>): boolean =>
  typeof caseRecord.docketNumber === 'string' &&
  Array.isArray(caseRecord.recalls);

const hasValidAppearances = (appearances: Record<string, unknown>): boolean => {
  const petitioners = appearances.petitioners as Record<string, unknown>;
  return (
    isNonNullObject(petitioners) &&
    Array.isArray(petitioners.appearances) &&
    Array.isArray(appearances.respondents)
  );
};

const hasValidProceedings = (proceedings: Record<string, unknown>): boolean =>
  Array.isArray(proceedings.motions) &&
  Array.isArray(proceedings.actionsAndFilings);

const hasValidEvidence = (evidence: Record<string, unknown>): boolean =>
  Array.isArray(evidence.petitionerWitnesses) &&
  Array.isArray(evidence.respondentWitnesses) &&
  Array.isArray(evidence.exhibits);
