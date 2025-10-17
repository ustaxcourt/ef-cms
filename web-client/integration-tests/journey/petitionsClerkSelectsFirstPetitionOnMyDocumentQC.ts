export const petitionsClerkSelectsFirstPetitionOnMyDocumentQC =
  cerebralTest => {
    return it('Petitions clerk selects first petition on My Document QC', () => {
      const workItem = cerebralTest
        .getState('workQueue')
        .find(
          workItemInQueue =>
            workItemInQueue.docketNumber === cerebralTest.docketNumber,
        );

      cerebralTest.docketEntryId = workItem.docketEntryId;
    });
  };
