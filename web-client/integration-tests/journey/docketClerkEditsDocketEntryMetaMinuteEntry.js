export const docketClerkEditsDocketEntryMetaMinuteEntry = cerebralTest => {
  return it('docket clerk edits docket entry meta for a minute entry', async () => {
    expect(cerebralTest.getState('currentPage')).toEqual('EditDocketEntryMeta');

    await cerebralTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'filingDate',
        value: '2020-01-04',
      },
    );

    await cerebralTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'filingDateDay',
        value: '04',
      },
    );

    await cerebralTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'filingDateMonth',
        value: '01',
      },
    );

    await cerebralTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'filingDateYear',
        value: '2020',
      },
    );

    await cerebralTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'documentTitle',
        value: 'Request for Place of Trial at Boise, Idaho',
      },
    );

    await cerebralTest.runSequence('submitEditDocketEntryMetaSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('alertSuccess')).toMatchObject({
      message: 'Docket entry changes saved.',
    });
  });
};
