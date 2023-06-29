export const docketClerkGetsDocketEntryByEventCode = (
  cerebralTest,
  eventCode,
) => {
  return it('Docket Clerk gets docket entry by event code', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const docketEntries = cerebralTest.getState('caseDetail.docketEntries');
    const foundDocketEntry = docketEntries.find(
      doc => doc.eventCode === eventCode,
    );

    expect(foundDocketEntry).toBeTruthy();

    cerebralTest.docketEntryId = foundDocketEntry.docketEntryId;
  });
};
