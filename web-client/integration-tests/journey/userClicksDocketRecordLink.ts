export const userClicksDocketRecordLink = (
  cerebralTest,
  shouldUserSeeDocketEntries,
) => {
  return it('should navigate to case-detail page', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    // get the state of the case detail to see if docket entries
    const docketEntries = await cerebralTest.getState(
      'caseDetail.docketEntries',
    );

    if (shouldUserSeeDocketEntries) {
      expect(docketEntries.length).toBeGreaterThan(0);
    } else {
      expect(docketEntries.length).toEqual(0);
    }
  });
};
