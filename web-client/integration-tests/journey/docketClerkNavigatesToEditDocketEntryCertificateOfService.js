export const docketClerkNavigatesToEditDocketEntryCertificateOfService = (
  test,
  docketRecordIndex = 2,
) => {
  it('the docketclerk navigates to page to edit docket entry meta for a minute entry', async () => {
    await test.runSequence('gotoEditDocketEntryMetaSequence', {
      docketNumber: test.docketNumber,
      docketRecordIndex,
    });

    expect(test.getState('form.numberOfPages')).toEqual(2);

    expect(test.getState('currentPage')).toEqual('EditDocketEntryMeta');
    expect(test.getState('screenMetadata.documentTitlePreview')).toEqual(
      'Certificate of Service of Petition 03-03-2003',
    );
    expect(test.getState('form.serviceDate')).toEqual(
      '2003-03-03T05:00:00.000Z',
    );

    await test.runSequence('updateDocketEntryMetaDocumentFormValueSequence', {
      key: 'serviceDateMonth',
      value: '05',
    });
    await test.runSequence('updateDocketEntryMetaDocumentFormValueSequence', {
      key: 'serviceDateDay',
      value: '10',
    });
    await test.runSequence('updateDocketEntryMetaDocumentFormValueSequence', {
      key: 'serviceDateYear',
      value: '2005',
    });

    expect(test.getState('screenMetadata.documentTitlePreview')).toEqual(
      'Certificate of Service of Petition 05-10-2005',
    );
    expect(test.getState('form.serviceDate')).toEqual(
      '2005-05-10T04:00:00.000Z',
    );

    await test.runSequence('submitEditDocketEntryMetaSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('alertSuccess')).toMatchObject({
      message: 'Docket entry changes saved.',
    });

    await test.runSequence('gotoEditDocketEntryMetaSequence', {
      docketNumber: test.docketNumber,
      docketRecordIndex,
    });

    expect(test.getState('form.numberOfPages')).toEqual(3);

    await test.runSequence('updateDocketEntryMetaDocumentFormValueSequence', {
      key: 'filingDateDay',
      value: '13',
    });
    await test.runSequence('updateDocketEntryMetaDocumentFormValueSequence', {
      key: 'filingDateMonth',
      value: '07',
    });
    await test.runSequence('updateDocketEntryMetaDocumentFormValueSequence', {
      key: 'filingDateYear',
      value: '2002',
    });

    await test.runSequence('submitEditDocketEntryMetaSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('alertSuccess')).toMatchObject({
      message: 'Docket entry changes saved.',
    });

    await test.runSequence('gotoEditDocketEntryMetaSequence', {
      docketNumber: test.docketNumber,
      docketRecordIndex,
    });

    expect(test.getState('form.numberOfPages')).toEqual(4);

    await test.runSequence('updateDocketEntryMetaDocumentFormValueSequence', {
      key: 'eventCode',
      value: 'BND',
    });

    await test.runSequence('submitEditDocketEntryMetaSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('alertSuccess')).toMatchObject({
      message: 'Docket entry changes saved.',
    });

    await test.runSequence('gotoEditDocketEntryMetaSequence', {
      docketNumber: test.docketNumber,
      docketRecordIndex,
    });

    expect(test.getState('form.numberOfPages')).toEqual(5);
  });
};
