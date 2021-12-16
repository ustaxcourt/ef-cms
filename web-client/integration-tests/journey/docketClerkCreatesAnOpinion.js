export const docketClerkCreatesAnOpinion = (cerebralTest, fakeFile) => {
  return it('Docket Clerk creates an opinion', async () => {
    // prereq. already logged in as docket clerk

    // 1. Upload PDF (uploadCourtIssuedDocketEntrySequence)
    cerebralTest.getSequence('gotoUploadCourtIssuedDocumentSequence')({
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'freeText',
      value: 'My Awesome Opinion',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });
    await cerebralTest.runSequence('validateUploadCourtIssuedDocumentSequence');

    await cerebralTest.runSequence('uploadCourtIssuedDocumentSequence');

    // 2. add docket entry
    // t.c. opinion
    // select judge
    // save and serve
  });
};
