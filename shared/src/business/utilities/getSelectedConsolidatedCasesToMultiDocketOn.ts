export type CaseWithSelectionInfo = {
  checked: boolean;
  docketNumberWithSuffix: string;
};

export const getSelectedConsolidatedCasesToMultiDocketOn = (
  consolidatedCases?: CaseWithSelectionInfo[],
): string[] | [] => {
  if (!consolidatedCases) return [];
  const checkedCases = consolidatedCases
    .filter(consolidatedCase => consolidatedCase.checked)
    .map(consolidatedCase => consolidatedCase.docketNumberWithSuffix);
  return checkedCases;
};
