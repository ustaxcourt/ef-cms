export const removeServedParties = (
  docketEntries: RawDocketEntry[],
): RawDocketEntry[] => {
  return docketEntries.map(de => {
    const result: RawDocketEntry = {
      ...de,
      servedParties: undefined,
    };
    if (de.secondaryDocument?.previousDocument?.servedParties) {
      result.secondaryDocument = {
        ...de.secondaryDocument,
        previousDocument: {
          ...de.secondaryDocument.previousDocument,
          servedParties: undefined,
        },
      };
    }
    return result;
  });
};
