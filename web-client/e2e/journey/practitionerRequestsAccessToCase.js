export default (test, fakeFile) => {
  return it('Practitioner requests access to case', async () => {
    await test.runSequence('gotoRequestAccessSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('reviewRequestAccessInformationSequence');

    expect(test.getState('validationErrors')).toEqual({
      certificateOfService: 'Enter selection for Certificate of Service.',
      documentTitle: 'Select a document.',
      documentType: 'Select a document.',
      eventCode: 'Select a document.',
      partyPrimary: 'Select a party.',
      primaryDocumentFile: 'A file was not selected.',
      scenario: 'Select a document.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'documentType',
      value: 'Entry of Appearance',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'documentTitle',
      value: 'Entry of Appearance',
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
      partyPrimary: 'Select a party.',
      primaryDocumentFile: 'A file was not selected.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({
      certificateOfService: 'Enter selection for Certificate of Service.',
      partyPrimary: 'Select a party.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'certificateOfService',
      value: true,
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({
      certificateOfServiceDate: 'Enter a Certificate of Service Date.',
      partyPrimary: 'Select a party.',
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
      partyPrimary: 'Select a party.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'certificateOfServiceYear',
      value: '2000',
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({
      partyPrimary: 'Select a party.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'partySecondary',
      value: true,
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('reviewRequestAccessInformationSequence');
    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitCaseAssociationRequestSequence');
  });
};
