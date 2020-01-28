export default test => {
  return it('docket clerk edits petitioner information', async () => {
    await test.runSequence('gotoEditPetitionerInformationSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.name',
      value: 'Bob',
    });

    await test.runSequence('updatePetitionerInformationFormSequence');
  });
};
