import { addDocketEntryHelper } from '../../src/presenter/computeds/addDocketEntryHelper';
import { runCompute } from 'cerebral/test';

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
      documentType: 'You must select a document type.',
      eventCode: 'Select a document type.',
      partyPrimary: 'Select a filing party.',
      primaryDocumentFile: 'A file was not selected.',
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
      secondaryDocument: 'You must select a document.',
      secondaryDocumentFile: 'A file was not selected.',
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
    });

    expect(test.getState('alertSuccess').title).toEqual(
      'Your entry has been added to the docket record.',
    );

    //supporting document 1
    expect(test.getState('currentPage')).toEqual('AddDocketEntry');

    expect(test.getState('form.primaryDocumentFile')).toBeUndefined();
    expect(test.getState('screenMetadata.supporting')).toEqual(true);
    expect(test.getState('screenMetadata.filedDocumentIds').length).toEqual(2);
    expect(test.getState('screenMetadata.primary')).toBeDefined();
    expect(test.getState('screenMetadata.secondary')).toBeDefined();

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'AFF',
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'Test Person',
    });

    const helper = runCompute(addDocketEntryHelper, {
      state: test.getState(),
    });

    expect(helper.previouslyFiledWizardDocuments).toEqual([
      'Motion for Leave to File Amendment to Seriatim Opening Brief',
      'Amendment to Seriatim Opening Brief',
    ]);

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'previousDocument',
      value: 'Amendment to Seriatim Opening Brief',
    });

    expect(test.getState('form.partyPrimary')).toEqual(true);

    await test.runSequence('updateScreenMetadataSequence', {
      key: 'supportingDocument',
      value: true,
    });

    await test.runSequence('submitDocketEntrySequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('alertSuccess').title).toEqual(
      'Your entry has been added to the docket record.',
    );

    //supporting document 2
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'AFF',
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'Test Person',
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'previousDocument',
      value: 'Motion for Leave to File Amendment to Seriatim Opening Brief',
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'attachments',
      value: false,
    });

    await test.runSequence('updateScreenMetadataSequence', {
      key: 'supportingDocument',
      value: false,
    });

    await test.runSequence('submitDocketEntrySequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('alertSuccess').title).toEqual(
      'Your docket entry is complete.',
    );

    expect(test.getState('caseDetail.docketRecord').length).toEqual(12);
  });
};
