type DetermineMovantArgs = {
  caseDetail: { petitioners: { contactId?: string; name: string }[] };
  motion: {
    filedBy?: string;
    filers?: string[];
    otherFilingParty?: string;
    partyIrsPractitioner?: boolean;
  };
};

const startsSegment = (textBefore: string): boolean =>
  textBefore === '' || /[&,.]\s+$/.test(textBefore);

const endsSegment = (textAfter: string): boolean =>
  textAfter === '' || /^\s*[&,]/.test(textAfter);

const filedByNamesParty = (filedBy: string, name: string): boolean => {
  if (!name || !filedBy) return false;

  for (
    let index = filedBy.indexOf(name);
    index !== -1;
    index = filedBy.indexOf(name, index + 1)
  ) {
    if (
      startsSegment(filedBy.slice(0, index)) &&
      endsSegment(filedBy.slice(index + name.length))
    ) {
      return true;
    }
  }

  return false;
};

// generateFiledBy prefixes the respondent as `Resp.`, so entries whose partyIrsPractitioner
// flag was never persisted (legacy or migrated data) are still recognized from filedBy, the
// same way petitioners are matched by name.
const filedByNamesRespondent = (filedBy: string): boolean =>
  /^Resp(?:t)?\.(?=$|[\s,&])/.test(filedBy);

// The other filing party is free text appended to the end of filedBy; dropping it keeps
// a party whose name matches a petitioner's from being mistaken for that petitioner.
const withoutOtherFilingParty = (
  filedBy: string,
  otherFilingParty?: string,
): string => {
  if (!otherFilingParty || !filedBy.endsWith(otherFilingParty)) return filedBy;

  return filedBy
    .slice(0, filedBy.length - otherFilingParty.length)
    .replace(/,\s*$/, '');
};

export const determineMovantAndNonMovant = ({
  caseDetail,
  motion,
}: DetermineMovantArgs): { movant: string; nonMovant: string } => {
  const { petitioners } = caseDetail;
  // "petitioner" refers to the party in the abstract, so the label is plural whenever the
  // case has multiple petitioners, regardless of how many of them filed the motion.
  const pNames = petitioners.map(p => p.name);
  const petitioner = pNames.length > 1 ? 'petitioners' : 'petitioner';

  const filerContactIds = motion.filers || [];
  const otherFilingParty = motion.otherFilingParty?.trim();
  const filedByParties = withoutOtherFilingParty(
    (motion.filedBy || '').trim(),
    otherFilingParty,
  );

  const petitionerIsFiling =
    petitioners.some(
      p => p.contactId && filerContactIds.includes(p.contactId),
    ) || pNames.some(name => filedByNamesParty(filedByParties, name));
  const respondentIsFiling =
    !!motion.partyIrsPractitioner || filedByNamesRespondent(filedByParties);

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
