export default test => {
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
      value: 'Answer',
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
      value: 'Statement',
    });

    await test.runSequence('selectDocumentSequence');

    expect(test.getState('validationErrors')).toEqual({
      documentType: 'You must select a document type.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'documentType',
      value: 'Statement [anything]',
    });

    await test.runSequence('selectDocumentSequence');

    expect(test.getState('validationErrors')).toEqual({});
  });
};
