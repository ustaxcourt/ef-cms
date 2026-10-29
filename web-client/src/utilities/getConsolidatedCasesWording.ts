export type ConsolidatedCasesWording = {
  calendaredPreamble: string;
  orderedSubject: string;
};

export const getConsolidatedCasesWording = (
  isAllCasesInGroup: boolean,
): ConsolidatedCasesWording => ({
  calendaredPreamble: isAllCasesInGroup
    ? 'These consolidated cases are'
    : 'This case is',
  orderedSubject: isAllCasesInGroup ? 'these cases are' : 'this case is',
});
