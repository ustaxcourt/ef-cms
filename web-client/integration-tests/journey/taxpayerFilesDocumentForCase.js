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
      category: 'Select a Category.',
      documentType: 'Select a Document Type.',
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'category',
      value: 'Answer (filed by respondent only)',
    });

    await test.runSequence('validateSelectDocumentTypeSequence');
    expect(test.getState('validationErrors')).toEqual({
      documentType: 'Select a Document Type.',
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
      documentType: 'Select a Document Type.',
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
        category: 'Select a Category.',
        documentType: 'Select a Document Type.',
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
        freeText: 'Provide an answer.',
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
      primaryDocumentFile: 'Upload a document.',
      secondaryDocumentFile: 'Upload a document.',
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'certificateOfService',
      value: true,
    });

    await test.runSequence('addSupportingDocumentToFormSequence', {
      type: 'primary',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      certificateOfServiceDate: 'Enter date for Certificate of Service.',
      objections: 'Enter selection for Objections.',
      primaryDocumentFile: 'Upload a document.',
      secondaryDocumentFile: 'Upload a document.',
      supportingDocuments: [
        {
          index: 0,
          supportingDocument: 'Select a Document Type.',
        },
      ],
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'objections',
      value: 'no',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      certificateOfServiceDate: 'Enter date for Certificate of Service.',
      primaryDocumentFile: 'Upload a document.',
      secondaryDocumentFile: 'Upload a document.',
      supportingDocuments: [
        {
          index: 0,
          supportingDocument: 'Select a Document Type.',
        },
      ],
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
      primaryDocumentFile: 'Upload a document.',
      secondaryDocumentFile: 'Upload a document.',
      supportingDocuments: [
        {
          index: 0,
          supportingDocument: 'Select a Document Type.',
        },
      ],
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'certificateOfServiceYear',
      value: '2000',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      primaryDocumentFile: 'Upload a document.',
      secondaryDocumentFile: 'Upload a document.',
      supportingDocuments: [
        {
          index: 0,
          supportingDocument: 'Select a Document Type.',
        },
      ],
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'supportingDocuments.0.supportingDocument',
      value: 'Affidavit in Support',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      primaryDocumentFile: 'Upload a document.',
      secondaryDocumentFile: 'Upload a document.',
      supportingDocuments: [
        {
          index: 0,
          supportingDocumentFile: 'Upload a document.',
          supportingDocumentFreeText: 'Enter name.',
        },
      ],
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'supportingDocuments.0.supportingDocumentFreeText',
      value: 'Affidavit in Support',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      primaryDocumentFile: 'Upload a document.',
      secondaryDocumentFile: 'Upload a document.',
      supportingDocuments: [
        {
          index: 0,
          supportingDocumentFile: 'Upload a document.',
        },
      ],
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
      key: 'supportingDocuments.0.supportingDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('addSupportingDocumentToFormSequence', {
      type: 'secondary',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      secondarySupportingDocuments: [
        {
          index: 0,
          supportingDocument: 'Select a Document Type.',
        },
      ],
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondarySupportingDocuments.0.supportingDocument',
      value: 'Declaration in Support',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      secondarySupportingDocuments: [
        {
          index: 0,
          supportingDocumentFile: 'Upload a document.',
          supportingDocumentFreeText: 'Enter name.',
        },
      ],
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondarySupportingDocuments.0.supportingDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondarySupportingDocuments.0.supportingDocumentFreeText',
      value: 'Declaration in Support',
    });

    await test.runSequence('reviewExternalDocumentInformationSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitExternalDocumentSequence');
  });
};
