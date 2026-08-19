type DetermineMovantArgs = {
  caseDetail: { petitioners: { contactId?: string; name: string }[] };
  motion: {
    filedBy?: string;
    filers?: string[];
    otherFilingParty?: string;
    partyIrsPractitioner?: boolean;
  };
};

export const determineMovantAndNonMovant = ({
  caseDetail,
  motion,
}: DetermineMovantArgs): { movant: string; nonMovant: string } => {
  const { petitioners } = caseDetail;
  const pNames = petitioners.map(p => p.name);
  const petitioner = pNames.length > 1 ? 'petitioners' : 'petitioner';

  const filerContactIds = motion.filers || [];
  const cleanedFiledBy = (motion.filedBy || '').replace(
    /^(?:Petr\.|Respt\.)?\s*/,
    '',
  );

  const petitionerIsFiling =
    petitioners.some(
      p => p.contactId && filerContactIds.includes(p.contactId),
    ) || pNames.some(name => cleanedFiledBy.includes(name));
  const respondentIsFiling = !!motion.partyIrsPractitioner;
  const otherFilingParty = motion.otherFilingParty?.trim();

  if (petitionerIsFiling && respondentIsFiling) {
    return { movant: 'the parties', nonMovant: 'the parties' };
  }

  if (petitionerIsFiling) {
    return { movant: petitioner, nonMovant: 'respondent' };
  }

  if (respondentIsFiling) {
    return { movant: 'respondent', nonMovant: petitioner };
  }

  if (otherFilingParty) {
    return { movant: otherFilingParty, nonMovant: 'the parties' };
  }

  return { movant: 'respondent', nonMovant: petitioner };
};
