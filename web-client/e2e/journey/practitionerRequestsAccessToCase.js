export default (test, fakeFile) => {
  return it('Practitioner requests access to case', async () => {
    await test.runSequence('gotoRequestAccessSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('reviewRequestAccessInformationSequence');

    expect(test.getState('validationErrors')).toEqual({
      certificateOfService: 'Enter selection for Certificate of Service.',
      documentTitleTemplate: 'Select a document.',
      documentType: 'Select a document.',
      eventCode: 'Select a document.',
      primaryDocumentFile: 'A file was not selected.',
      representingPrimary: 'Select a party.',
      scenario: 'Select a document.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'documentType',
      value: 'Entry of Appearance',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'documentTitleTemplate',
      value: 'Entry of Appearance for [Petitioner Names]',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'eventCode',
      value: 'EA',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'scenario',
      value: 'Standard',
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({
      certificateOfService: 'Enter selection for Certificate of Service.',
      primaryDocumentFile: 'A file was not selected.',
      representingPrimary: 'Select a party.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({
      certificateOfService: 'Enter selection for Certificate of Service.',
      representingPrimary: 'Select a party.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'certificateOfService',
      value: true,
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({
      certificateOfServiceDate: 'Enter a Certificate of Service Date.',
      representingPrimary: 'Select a party.',
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

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({
      certificateOfServiceDate:
        'Certificate of Service date is in the future. Please enter a valid date.',
      representingPrimary: 'Select a party.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'certificateOfServiceYear',
      value: '2000',
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({
      representingPrimary: 'Select a party.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'representingSecondary',
      value: true,
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('reviewRequestAccessInformationSequence');

    expect(test.getState('form.documentTitle')).toEqual(
      'Entry of Appearance for Petr. Test Person',
    );
    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitCaseAssociationRequestSequence');
  });
};
