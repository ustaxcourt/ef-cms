export default (test, fakeFile) => {
  return it('Respondent adds stipulated decision', async () => {
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
      value: 'Decision',
    });

    await test.runSequence('validateSelectDocumentTypeSequence');
    expect(test.getState('validationErrors')).toEqual({
      documentType: 'You must select a document type.',
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'documentType',
      value: 'Proposed Stipulated Decision',
    });

    await test.runSequence('validateSelectDocumentTypeSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('selectDocumentSequence');

    expect(test.getState('form.documentType')).toEqual(
      'Proposed Stipulated Decision',
    );

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'certificateOfService',
      value: false,
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'attachments',
      value: false,
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'hasSupportingDocuments',
      value: false,
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'partyRespondent',
      value: true,
    });

    await test.runSequence('reviewExternalDocumentInformationSequence');

    await test.runSequence('submitExternalDocumentSequence');

    expect(test.getState('caseDetail.documents').length).toEqual(4);
  });
};
