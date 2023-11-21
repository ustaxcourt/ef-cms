export type ConsolidatedCasesWithCheckboxInfoType = {
  checked: boolean;
  docketNumberWithSuffix: string;
};

export const getSelectedConsolidatedCasesToMultiDocketOn = (
  consolidatedCases: ConsolidatedCasesWithCheckboxInfoType[],
): string[] | [] => {
  if (!consolidatedCases.length) return [];
  const checkedCases = consolidatedCases
    .filter(consolidatedCase => consolidatedCase.checked)
    .map(consolidatedCase => consolidatedCase.docketNumberWithSuffix);
  return checkedCases;
};
