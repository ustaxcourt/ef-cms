export default test => {
  return it('docket clerk edits docket entry meta', async () => {
    expect(test.getState('currentPage')).toEqual('EditDocketEntryMeta');

    await test.runSequence('updateDocketEntryMetaDocumentFormValueSequence', {
      key: 'filedBy',
      value: 'New Filer',
    });

    await test.runSequence('updateDocketEntryMetaDocumentFormValueSequence', {
      key: 'filingDate',
      value: '2020-01-04',
    });

    await test.runSequence('updateDocketEntryMetaDocumentFormValueSequence', {
      key: 'filingDateDay',
      value: '04',
    });

    await test.runSequence('updateDocketEntryMetaDocumentFormValueSequence', {
      key: 'filingDateMonth',
      value: '01',
    });

    await test.runSequence('updateDocketEntryMetaDocumentFormValueSequence', {
      key: 'filingDateYear',
      value: '2020',
    });

    await test.runSequence('updateDocketEntryMetaDocumentFormValueSequence', {
      key: 'additionalInfo',
      value: 'Additional info.',
    });

    await test.runSequence('submitEditDocketEntryMetaSequence');

    expect(test.getState('alertSuccess')).toMatchObject({
      message: 'You can view your updates to the Docket Record below.',
      title: 'Your changes have been saved.',
    });
  });
};
