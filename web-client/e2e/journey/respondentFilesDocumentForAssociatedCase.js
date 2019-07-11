export default (test, fakeFile) => {
  return it('Respondent files document for associated case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('gotoFileDocumentSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'category',
      value: 'Miscellaneous',
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'documentType',
      value: 'Civil Penalty Approval Form',
    });

    await test.runSequence('validateSelectDocumentTypeSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('selectDocumentSequence');

    expect(test.getState('form.documentType')).toEqual(
      'Civil Penalty Approval Form',
    );

    expect(test.getState('form.partyPrimary')).toEqual(undefined);

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'certificateOfService',
      value: true,
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'hasSupportingDocuments',
      value: false,
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'attachments',
      value: false,
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'exhibits',
      value: false,
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'objections',
      value: 'no',
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
      value: '2000',
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'partyPrimary',
      value: true,
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'partyRespondent',
      value: true,
    });

    await test.runSequence('reviewExternalDocumentInformationSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitExternalDocumentSequence');
  });
};
