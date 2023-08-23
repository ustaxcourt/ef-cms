export const docketClerkStrikesDocketEntry = (
  cerebralTest,
  docketRecordIndex,
) => {
  return it('docket clerk strikes docket entry', async () => {
    await cerebralTest.runSequence('strikeDocketEntrySequence');
    console.log('docketRecordIndex FOR STRIKING', docketRecordIndex);

    const caseDocuments = cerebralTest.getState('caseDetail.docketEntries');
    console.log('caseDocuments', caseDocuments);
    const strickenDocument = caseDocuments.find(
      d => d.index === docketRecordIndex,
    );
    console.log('strickenDocument', strickenDocument);
    expect(strickenDocument.isStricken).toEqual(true);
    expect(strickenDocument.strickenBy).toEqual('Test Docketclerk');
  });
};
