export const admissionsClerkEditsPractitionerInfo = test => {
  return it('admissions clerk edits practitioner information', async () => {
    await test.runSequence('gotoEditPractitionerUserSequence', {
      barNumber: test.barNumber,
    });

    expect(test.getState('currentPage')).toEqual('EditPractitionerUser');
    expect(test.getState('form.barNumber')).toEqual(test.barNumber);

    await test.runSequence('updateFormValueSequence', {
      key: 'firstName',
      value: 'Ben',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'middleName',
      value: 'Leighton',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'lastName',
      value: 'Matlock',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: '123 Legal Way',
    });

    await test.runSequence('submitUpdatePractitionerUserSequence');

    expect(test.getState('currentPage')).toEqual('PractitionerDetail');
    expect(test.getState('practitionerDetail.barNumber')).toEqual(
      test.barNumber,
    );
    expect(test.getState('practitionerDetail.name')).toEqual(
      'Ben Leighton Matlock',
    );
    expect(test.getState('practitionerDetail.contact.address1')).toEqual(
      '123 Legal Way',
    );

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const caseDetail = test.getState('caseDetail');
    const noticeDocument = caseDetail.docketEntries.find(
      document => document.documentType === 'Notice of Change of Address',
    );

    expect(noticeDocument).toBeTruthy();
    expect(noticeDocument.additionalInfo).toEqual('for Ben Leighton Matlock');
  });
};
