export const userVerifiesLengthOfDocketEntry = (
  cerebralTest,
  eventCode,
  length,
) =>
  it(`internal user verifies that docket entry with eventCode ${eventCode} is ${length} pages long`, async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(
      cerebralTest
        .getState('caseDetail.docketEntries')
        .find(entry => entry.eventCode === eventCode),
    ).toMatchObject({
      numberOfPages: length,
    });
  });
