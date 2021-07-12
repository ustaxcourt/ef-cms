export const docketClerkStrikesDocketEntry = (
  cerebralTest,
  docketRecordIndex,
) => {
  return it('docket clerk strikes docket entry', async () => {
    await cerebralTest.runSequence('strikeDocketEntrySequence');

    const caseDocuments = cerebralTest.getState('caseDetail.docketEntries');
    const strickenDocument = caseDocuments.find(
      d => d.index === docketRecordIndex,
    );

    expect(strickenDocument.isStricken).toEqual(true);
    expect(strickenDocument.strickenBy).toEqual('Test Docketclerk');
  });
};
