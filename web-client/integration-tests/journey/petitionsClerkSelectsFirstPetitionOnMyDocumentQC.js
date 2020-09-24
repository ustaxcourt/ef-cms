export const petitionsClerkSelectsFirstPetitionOnMyDocumentQC = test => {
  return it('Petitions clerk selects first petition on My Document QC', async () => {
    const workItem = test
      .getState('workQueue')
      .find(workItem => workItem.docketNumber === test.docketNumber);

    const { docketEntryId } = workItem.docketEntry;

    test.docketEntryId = docketEntryId;
  });
};
