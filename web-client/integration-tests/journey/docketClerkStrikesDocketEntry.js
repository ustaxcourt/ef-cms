export const docketClerkStrikesDocketEntry = (test, docketRecordIndex) => {
  return it('docket clerk strikes docket entry', async () => {
    await test.runSequence('strikeDocketEntrySequence');

    const caseDocuments = test.getState('caseDetail.docketEntries');
    const strickenDocument = caseDocuments.find(
      d => d.index === docketRecordIndex,
    );

    expect(strickenDocument.isStricken).toEqual(true);
    expect(strickenDocument.strickenBy).toEqual('Test Docketclerk');
  });
};
