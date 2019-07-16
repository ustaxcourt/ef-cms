export default (test, fakeFile) => {
  return it('Taxpayer files document for case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('gotoFileDocumentSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('selectDocumentSequence');

    expect(test.getState('validationErrors')).toEqual({
      category: 'You must select a category.',
      documentType: 'You must select a document type.',
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'category',
      value: 'Answer (filed by respondent only)',
    });

    await test.runSequence('validateSelectDocumentTypeSequence');
    expect(test.getState('validationErrors')).toEqual({
      documentType: 'You must select a document type.',
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'documentType',
      value: 'Answer',
    });

    await test.runSequence('validateSelectDocumentTypeSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('selectDocumentSequence');

    expect(test.getState('form.documentType')).toEqual('Answer');

    await test.runSequence('editSelectedDocumentSequence');

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'category',
      value: 'Motion',
    });

    await test.runSequence('clearWizardDataSequence', {
      key: 'category',
    });

    await test.runSequence('selectDocumentSequence');

    expect(test.getState('validationErrors')).toEqual({
      documentType: 'You must select a document type.',
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'documentType',
      value: 'Motion for Leave to File Out of Time',
    });

    await test.runSequence('selectDocumentSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('selectDocumentSequence');

    expect(test.getState('validationErrors')).toEqual({
      secondaryDocument: {
        category: 'You must select a category.',
        documentType: 'You must select a document type.',
      },
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondaryDocument.category',
      value: 'Statement',
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondaryDocument.documentType',
      value: 'Statement',
    });

    await test.runSequence('selectDocumentSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('selectDocumentSequence');

    expect(test.getState('validationErrors')).toEqual({
      secondaryDocument: {
        freeText: 'You must provide a value.',
      },
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondaryDocument.freeText',
      value: 'Anything',
    });

    await test.runSequence('selectDocumentSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('form.documentTitle')).toEqual(
      'Motion for Leave to File Out of Time Statement Anything',
    );

    expect(test.getState('form.partyPrimary')).toEqual(true);

    await test.runSequence('reviewExternalDocumentInformationSequence');

    expect(test.getState('validationErrors')).toEqual({
      objections: 'Enter selection for Objections.',
      primaryDocumentFile: 'A file was not selected.',
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'certificateOfService',
      value: true,
    });

    await test.runSequence('addSupportingDocumentToFormSequence', {
      type: 'primary'
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      certificateOfServiceDate: 'Enter a Certificate of Service Date.',
      objections: 'Enter selection for Objections.',
      primaryDocumentFile: 'A file was not selected.',
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'objections',
      value: 'no',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      certificateOfServiceDate: 'Enter a Certificate of Service Date.',
      primaryDocumentFile: 'A file was not selected.',
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'certificateOfServiceMonth',
      value: '12',
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'certificateOfServiceDay',
      value: '12',
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'certificateOfServiceYear',
      value: '5000',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      certificateOfServiceDate:
        'Certificate of Service date is in the future. Please enter a valid date.',
      primaryDocumentFile: 'A file was not selected.',
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'certificateOfServiceYear',
      value: '2000',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      primaryDocumentFile: 'A file was not selected.',
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'supportingDocument',
      value: 'Affidavit in Support',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      primaryDocumentFile: 'A file was not selected.',
      //supportingDocumentFile: 'A file was not selected.',
      //supportingDocumentFreeText: 'Please provide a value.',
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'supportingDocumentFreeText',
      value: 'Affidavit in Support',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      primaryDocumentFile: 'A file was not selected.',
      //supportingDocumentFile: 'A file was not selected.',
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondaryDocumentFile',
      value: fakeFile,
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'supportingDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('addSupportingDocumentToFormSequence', {
      type: 'secondary'
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      //secondarySupportingDocument:
      //  'Enter selection for Secondary Supporting Document.',
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondarySupportingDocument',
      value: 'Declaration in Support',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      //secondarySupportingDocumentFile: 'A file was not selected.',
      //secondarySupportingDocumentFreeText: 'Please provide a value.',
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondarySupportingDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondarySupportingDocumentFreeText',
      value: 'Declaration in Support',
    });

    await test.runSequence('reviewExternalDocumentInformationSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitExternalDocumentSequence');

    // expect(test.getState('validationErrors')).toEqual({});
    // expect(test.getState('alertSuccess')).toEqual({});
  });
};
