export default (test, fakeFile) => {
  return it('Docketclerk adds docket entries', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('gotoAddDocketEntrySequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateScreenMetadataSequence', {
      key: 'supportingDocument',
      value: false,
    });

    await test.runSequence('submitDocketEntrySequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('validationErrors')).toEqual({
      dateReceived: 'Enter date received.',
      documentType: 'Select a document type',
      eventCode: 'Select a document type',
      partyPrimary: 'Select a filing party',
    });

    //primary document
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedMonth',
      value: 1,
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedDay',
      value: 1,
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedYear',
      value: 2018,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFileSize',
      value: 100,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'partyPrimary',
      value: true,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'M115',
    });

    expect(test.getState('form.documentType')).toEqual(
      'Motion for Leave to File',
    );

    await test.runSequence('updateScreenMetadataSequence', {
      key: 'supportingDocument',
      value: false,
    });

    await test.runSequence('submitDocketEntrySequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('validationErrors')).toEqual({
      objections: 'Enter selection for Objections.',
      secondaryDocument: 'Select a document',
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'objections',
      value: 'No',
    });

    //secondary document
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocument.eventCode',
      value: 'ASTF',
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocumentFileSize',
      value: 100,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocument.additionalInfo',
      value: 'Test Secondary Additional Info',
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocument.addToCoversheet',
      value: true,
    });

    await test.runSequence('updateScreenMetadataSequence', {
      key: 'supportingDocument',
      value: true,
    });

    await test.runSequence('submitDocketEntrySequence', {
      docketNumber: test.docketNumber,
      isAddAnother: true,
    });

    expect(test.getState('alertSuccess').title).toEqual(
      'Your entry has been added to the docket record.',
    );

    expect(test.getState('currentPage')).toEqual('AddDocketEntry');
    expect(test.getState('form')).toEqual({
      lodged: false,
      practitioner: [],
    });
  });
};
