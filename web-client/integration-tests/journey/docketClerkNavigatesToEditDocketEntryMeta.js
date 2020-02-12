export default test => {
  it('the docketclerk navigates to page to edit docket entry meta', async () => {
    await test.runSequence('gotoEditDocketEntryMetaSequence', {
      docketNumber: test.docketNumber,
      docketRecordIndex: 1,
    });

    console.log('state', test.getState('form'));
    console.log('caseDetail', test.getState('caseDetail'));
  });
};
