const getSortableDocketNumber = (docketNumber?: string) => {
  if (!docketNumber) {
    return;
  }

  // NOTE: 1574-65 is the oldest case in DAWSON, which was filed in 1965
  const oldestYear = 65;

  const [sequentialNumber, yearFiled] = docketNumber.split('-');
  const sequentialNumberPadded = sequentialNumber.padStart(6, '0');
  const yearFiledAdjusted =
    parseInt(yearFiled) >= oldestYear ? `19${yearFiled}` : `20${yearFiled}`;

  return parseInt(`${yearFiledAdjusted}${sequentialNumberPadded}`);
};

export const sortByDocketNumber = <T>(
  cases: (T & { docketNumber: string })[],
): T[] => {
  return cases.sort((a, b) => {
    return docketNumberComparator(a.docketNumber, b.docketNumber);
  });
};

const docketNumberComparator = (
  docketNumberA?: string,
  docketNumberB?: string,
) => {
  return (
    (getSortableDocketNumber(docketNumberA) || 0) -
    (getSortableDocketNumber(docketNumberB) || 0)
  );
};

export const sortByDocketNumberAndGroupConsolidatedCases = <
  T extends { leadDocketNumber?: string; docketNumber: string },
>(
  cases: T[],
): T[] => {
  let nonMemberCases: T[] = [];
  let memberCases: { [key: string]: T[] } = {};

  // Create a set of docket numbers for quick lookup
  const docketNumbers = new Set(cases.map(c => c.docketNumber));

  // Group cases into 1) lead or non-member cases and 2) valid non-lead, member cases
  for (const c of cases) {
    if (
      c.leadDocketNumber &&
      c.leadDocketNumber !== c.docketNumber &&
      docketNumbers.has(c.leadDocketNumber) // Check if the lead case exists; if not, treat as a lead/non-member case
    ) {
      (memberCases[c.leadDocketNumber] ||= []).push(c);
    } else {
      nonMemberCases.push(c);
    }
  }

  // Sort the lead/non-member cases
  sortByDocketNumber(nonMemberCases);

  // Then, sort and interpolate the non-lead, member cases
  const interpolatedCases: T[] = [];
  for (const caseItem of nonMemberCases) {
    interpolatedCases.push(caseItem);

    // Append and sort member cases inline if leadDocketNumber exists
    if (memberCases[caseItem.docketNumber]) {
      interpolatedCases.push(
        ...sortByDocketNumber(memberCases[caseItem.docketNumber]),
      );
    }
  }

  return interpolatedCases;
};
