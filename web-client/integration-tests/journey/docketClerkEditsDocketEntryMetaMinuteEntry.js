export const docketClerkEditsDocketEntryMetaMinuteEntry = test => {
  return it('docket clerk edits docket entry meta for a minute entry', async () => {
    expect(test.getState('currentPage')).toEqual('EditDocketEntryMeta');

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
      key: 'documentTitle',
      value: 'Request for Place of Trial at Boise, Idaho',
    });

    await test.runSequence('submitEditDocketEntryMetaSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('alertSuccess')).toMatchObject({
      message: 'Docket entry changes saved.',
    });
  });
};
