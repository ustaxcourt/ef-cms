export const JUDGE_ASSIGNMENTS = {
  CHIEF_JUDGE: 'CHIEF_JUDGE',
  LAST_KNOWN_JUDGE: 'LAST_KNOWN_JUDGE',
  TRIAL_SESSION_JUDGE: 'TRIAL_SESSION_JUDGE',
  UNASSIGNED: 'UNASSIGNED',
};

export const getJudgeAssociationForCaseStatus = ({
  applicationContext,
  caseDetail,
}) => {
  const { Case } = applicationContext.getEntityConstructors();
  if (
    [
      Case.STATUS_TYPES.batchedForIRS,
      Case.STATUS_TYPES.generalDocket,
      Case.STATUS_TYPES.generalDocketReadyForTrial,
      Case.STATUS_TYPES.new,
      Case.STATUS_TYPES.recalled,
    ].includes(caseDetail.status)
  ) {
    return JUDGE_ASSIGNMENTS.CHIEF_JUDGE;
  } else if (caseDetail.status === Case.STATUS_TYPES.calendared) {
    return JUDGE_ASSIGNMENTS.TRIAL_SESSION_JUDGE;
  } else if (caseDetail.status === Case.STATUS_TYPES.closed) {
    return JUDGE_ASSIGNMENTS.LAST_KNOWN_JUDGE;
  }
};
