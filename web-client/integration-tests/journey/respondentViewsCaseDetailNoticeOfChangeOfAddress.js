export const respondentViewsCaseDetailNoticeOfChangeOfAddress = (
  test,
  createdDocketNumberIndex,
) => {
  return it('respondent views case detail notice of change of address', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.createdDocketNumbers[createdDocketNumberIndex],
    });

    expect(
      test.getState('caseDetail.irsPractitioners.0.contact'),
    ).toMatchObject({
      address1: test.updatedRespondentAddress,
    });

    const documents = test.getState('caseDetail.docketEntries');

    const changeOfAddressDocument = documents.find(
      document => document.documentType === 'Notice of Change of Address',
    );

    expect(changeOfAddressDocument.servedAt).toBeDefined();

    expect(changeOfAddressDocument).toBeDefined();

    expect(changeOfAddressDocument.documentTitle).toBe(
      'Notice of Change of Address',
    );
    expect(changeOfAddressDocument.additionalInfo).toBe(
      'for Test IRS Practitioner',
    );
    expect(changeOfAddressDocument.filedBy).toBe('Resp.');
  });
};
