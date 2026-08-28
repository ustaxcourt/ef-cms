type DetermineMovantArgs = {
  caseDetail: { petitioners: { name: string }[] };
  motion: { filedBy?: string };
};

export const determineMovantAndNonMovant = ({
  caseDetail,
  motion,
}: DetermineMovantArgs): { movant: string; nonMovant: string } => {
  const { petitioners } = caseDetail;
  const pNames = petitioners.map(p => p.name);
  const petitioner = pNames.length > 1 ? 'petitioners' : 'petitioner';
  const cleanedFiledBy = (motion.filedBy || '').replace(
    /^(?:Petr\.|Respt\.)?\s*/,
    '',
  );
  const movant = pNames.some(name => cleanedFiledBy.includes(name))
    ? petitioner
    : 'respondent';
  const nonMovant = movant === petitioner ? 'respondent' : petitioner;
  return { movant, nonMovant };
};
