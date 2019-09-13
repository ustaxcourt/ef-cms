export default (test, fakeFile) => {
  return it('Practitioner requests access to case', async () => {
    await test.runSequence('gotoRequestAccessSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('reviewRequestAccessInformationSequence');

    expect(test.getState('validationErrors')).toEqual({
      certificateOfService: 'Indicate whether you are including a Certificate of Service',
      documentTitleTemplate: 'Select a document',
      documentType: 'Select a document type',
      eventCode: 'Select a document',
      primaryDocumentFile: 'Upload a document',
      representingPrimary: 'Select a party',
      scenario: 'Select a document',
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'documentType',
      value: 'Motion to Substitute Parties and Change Caption',
    });
    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'documentTitleTemplate',
      value: 'Motion to Substitute Parties and Change Caption',
    });
    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'eventCode',
      value: 'M107',
    });
    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'scenario',
      value: 'Standard',
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({
      attachments: 'Enter selection for Attachments.',
      certificateOfService: 'Indicate whether you are including a Certificate of Service',
      exhibits: 'Enter selection for Exhibits.',
      hasSupportingDocuments: 'Enter selection for Supporting Documents.',
      objections: 'Enter selection for Objections.',
      primaryDocumentFile: 'Upload a document',
      representingPrimary: 'Select a party',
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfService',
      value: false,
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'objections',
      value: 'No',
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'exhibits',
      value: false,
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'attachments',
      value: false,
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'hasSupportingDocuments',
      value: true,
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'representingSecondary',
      value: true,
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({
      supportingDocument: 'Enter selection for Supporting Document.',
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'supportingDocument',
      value: 'Declaration in Support',
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'supportingDocumentMetadata.documentType',
      value: 'Declaration in Support',
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'supportingDocumentMetadata.category',
      value: 'Supporting Document',
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({
      supportingDocumentFile: 'Upload a document',
      supportingDocumentFreeText: 'Please provide a value.',
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'supportingDocumentFreeText',
      value: 'No',
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'supportingDocumentMetadata.freeText',
      value: 'No',
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'supportingDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('reviewRequestAccessInformationSequence');

    expect(test.getState('form.documentTitle')).toEqual(
      'Motion to Substitute Parties and Change Caption',
    );
    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitCaseAssociationRequestSequence');
  });
};
