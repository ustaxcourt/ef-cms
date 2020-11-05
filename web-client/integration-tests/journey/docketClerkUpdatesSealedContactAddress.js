export const docketClerkUpdatesSealedContactAddress = (test, contactType) => {
  return it('docket clerk updates sealed contact address', async () => {
    await test.runSequence('gotoEditPetitionerInformationSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateFormValueSequence', {
      key: `${contactType}.address1`,
      value: 'somewhere over the rainbow',
    });

    await test.runSequence('updatePetitionerInformationFormSequence');

    expect(
      test.getState('currentViewMetadata.caseDetail.caseInformationTab'),
    ).toEqual('petitioner');

    const docketEntries = test.getState('caseDetail.docketEntries');
    const noticeOfContactChange = docketEntries.find(
      d => d.eventCode === 'NCA',
    );

    expect(noticeOfContactChange).toBeUndefined();
  });
};
