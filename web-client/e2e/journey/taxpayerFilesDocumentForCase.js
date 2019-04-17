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

    await test.runSequence('updateFormValueSequence', {
      key: 'category',
      value: 'Answer (filed by respondent only)',
    });

    await test.runSequence('validateSelectDocumentTypeSequence');
    expect(test.getState('validationErrors')).toEqual({
      documentType: 'You must select a document type.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'documentType',
      value: 'Answer',
    });

    await test.runSequence('validateSelectDocumentTypeSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('selectDocumentSequence');

    expect(test.getState('form.documentType')).toEqual('Answer');

    await test.runSequence('editSelectedDocumentSequence');

    await test.runSequence('updateFormValueSequence', {
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

    await test.runSequence('updateFormValueSequence', {
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

    await test.runSequence('updateFormValueSequence', {
      key: 'secondaryDocument.category',
      value: 'Statement',
    });

    await test.runSequence('updateFormValueSequence', {
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

    await test.runSequence('updateFormValueSequence', {
      key: 'secondaryDocument.freeText',
      value: 'Anything',
    });

    await test.runSequence('selectDocumentSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('form.documentTitle')).toEqual(
      'Motion for Leave to File Out of Time Statement Anything',
    );

    await test.runSequence('reviewExternalDocumentInformationSequence');

    expect(test.getState('validationErrors')).toEqual({
      attachments: 'Enter selection for Attachments.',
      certificateOfService: 'Enter selection for Certificate of Service.',
      exhibits: 'Enter selection for Exhibits.',
      hasSecondarySupportingDocuments:
        'Enter selection for Secondary Supporting Documents.',
      hasSupportingDocuments: 'Enter selection for Supporting Documents.',
      objections: 'Enter selection for Objections.',
      primaryDocumentFile: 'A file was not selected.',
      secondaryDocumentFile: 'A file was not selected.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'certificateOfService',
      value: true,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'hasSupportingDocuments',
      value: true,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'hasSecondarySupportingDocuments',
      value: true,
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      attachments: 'Enter selection for Attachments.',
      certificateOfServiceDate: 'Enter a Certificate of Service Date.',
      exhibits: 'Enter selection for Exhibits.',
      objections: 'Enter selection for Objections.',
      primaryDocumentFile: 'A file was not selected.',
      secondaryDocumentFile: 'A file was not selected.',
      secondarySupportingDocument:
        'Enter selection for Secondary Supporting Document.',
      supportingDocument: 'Enter selection for Supporting Document.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'attachments',
      value: false,
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'exhibits',
      value: false,
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'objections',
      value: 'no',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      certificateOfServiceDate: 'Enter a Certificate of Service Date.',
      primaryDocumentFile: 'A file was not selected.',
      secondaryDocumentFile: 'A file was not selected.',
      secondarySupportingDocument:
        'Enter selection for Secondary Supporting Document.',
      supportingDocument: 'Enter selection for Supporting Document.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'certificateOfServiceMonth',
      value: '12',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'certificateOfServiceDay',
      value: '12',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'certificateOfServiceYear',
      value: '5000',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      certificateOfServiceDate:
        'Certificate of Service date is in the future. Please enter a valid date.',
      primaryDocumentFile: 'A file was not selected.',
      secondaryDocumentFile: 'A file was not selected.',
      secondarySupportingDocument:
        'Enter selection for Secondary Supporting Document.',
      supportingDocument: 'Enter selection for Supporting Document.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'certificateOfServiceYear',
      value: '2000',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      primaryDocumentFile: 'A file was not selected.',
      secondaryDocumentFile: 'A file was not selected.',
      secondarySupportingDocument:
        'Enter selection for Secondary Supporting Document.',
      supportingDocument: 'Enter selection for Supporting Document.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'secondarySupportingDocument',
      value: 'Declaration in Support',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'supportingDocument',
      value: 'Affidavit in Support',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      primaryDocumentFile: 'A file was not selected.',
      secondaryDocumentFile: 'A file was not selected.',
      secondarySupportingDocumentFile: 'A file was not selected.',
      secondarySupportingDocumentFreeText: 'Please provide a value.',
      supportingDocumentFile: 'A file was not selected.',
      supportingDocumentFreeText: 'Please provide a value.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'secondarySupportingDocumentFreeText',
      value: 'Declaration in Support',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'supportingDocumentFreeText',
      value: 'Affidavit in Support',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      primaryDocumentFile: 'A file was not selected.',
      secondaryDocumentFile: 'A file was not selected.',
      secondarySupportingDocumentFile: 'A file was not selected.',
      supportingDocumentFile: 'A file was not selected.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'secondaryDocumentFile',
      value: fakeFile,
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'secondarySupportingDocumentFile',
      value: fakeFile,
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'supportingDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('reviewExternalDocumentInformationSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitExternalDocumentSequence');

    // expect(test.getState('validationErrors')).toEqual({});
    // expect(test.getState('alertSuccess')).toEqual({});
  });
};
