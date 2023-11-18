// todo type input and output
export const getSelectedConsolidatedCasesToMultiDocketOn =
  consolidatedCases => {
    if (!consolidatedCases) return [];
    const checkedCases = consolidatedCases
      .filter(consolidatedCase => consolidatedCase.checked)
      .map(consolidatedCase => consolidatedCase.docketNumberWithSuffix);
    return checkedCases;
  };
