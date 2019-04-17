export default (test, fakeFile) => {
  return it('Respondent adds Motion with supporting Brief', async () => {
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
      value: 'Motion',
    });

    await test.runSequence('validateSelectDocumentTypeSequence');
    expect(test.getState('validationErrors')).toEqual({
      documentType: 'You must select a document type.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'documentType',
      value: 'Motion for Continuance',
    });

    await test.runSequence('validateSelectDocumentTypeSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('selectDocumentSequence');
    await test.runSequence('selectDocumentSequence');

    expect(test.getState('form.documentType')).toEqual(
      'Motion for Continuance',
    );

    await test.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'certificateOfService',
      value: false,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'exhibits',
      value: false,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'attachments',
      value: false,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'hasSupportingDocuments',
      value: true,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'supportingDocument',
      value: 'Brief in Support',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'supportingDocumentMetadata.category',
      value: 'Supporting Document',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'supportingDocumentMetadata.documentType',
      value: 'Brief in Support',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'supportingDocumentMetadata.previousDocument',
      value: 'Motion for Continuance',
    });

    await test.runSequence('reviewExternalDocumentInformationSequence');

    expect(test.getState('validationErrors')).toEqual({
      objections: 'Enter selection for Objections.',
      supportingDocumentFile: 'A file was not selected.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'objections',
      value: true,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'supportingDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('reviewExternalDocumentInformationSequence');

    await test.runSequence('submitExternalDocumentSequence');

    expect(test.getState('caseDetail.documents').length).toEqual(6);
  });
};
