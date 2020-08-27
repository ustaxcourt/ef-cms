export const docketClerkStrikesDocketEntry = (test, docketRecordIndex) => {
  return it('docket clerk strikes docket entry', async () => {
    await test.runSequence('strikeDocketEntrySequence');

    const caseDocketRecord = test.getState('caseDetail.docketRecord');
    const docketRecordEntry = caseDocketRecord.find(
      docketEntry => docketEntry.index === docketRecordIndex,
    );

    expect(docketRecordEntry.isStricken).toEqual(true);
    expect(docketRecordEntry.strickenBy).toEqual('Test Docketclerk');
  });
};
