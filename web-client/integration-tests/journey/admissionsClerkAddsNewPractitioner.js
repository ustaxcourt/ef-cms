export const admissionsClerkAddsNewPractitioner = test => {
  return it('admissions clerk adds a new practitioner', async () => {
    test.currentTimestamp = Date.now();

    await test.runSequence('gotoCreatePractitionerUserSequence');

    await test.runSequence('submitAddPractitionerSequence');

    expect(Object.keys(test.getState('validationErrors'))).toEqual([
      'phone',
      'email',
      'admissionsDate',
      'birthYear',
      'employer',
      'firstName',
      'lastName',
      'originalBarState',
      'practitionerType',
      'contact',
    ]);

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.phone',
      value: '111-111-1111',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'email',
      value: 'caroleBaskinH8r@example.com',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'month',
      value: '1',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'day',
      value: '1',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'year',
      value: '2010',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'birthYear',
      value: '1922',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'employer',
      value: 'Private',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'originalBarState',
      value: 'OK',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'practitionerType',
      value: 'Non-Attorney',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'firstName',
      value: `joe ${test.currentTimestamp}`,
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'lastName',
      value: 'exotic tiger king',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: '123 Zoo St',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contact.city',
      value: 'Middle of Nowhere',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contact.state',
      value: 'OK',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contact.postalCode',
      value: '09876',
    });

    await test.runSequence('submitAddPractitionerSequence');

    test.barNumber = test.getState('practitionerDetail.barNumber');

    expect(test.getState('validationErrors')).toEqual({});
  });
};
