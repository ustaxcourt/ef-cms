export const admissionsClerkAddsNewPractitioner = cerebralTest => {
  return it('admissions clerk adds a new practitioner', async () => {
    cerebralTest.currentTimestamp = Date.now();

    await cerebralTest.runSequence('gotoCreatePractitionerUserSequence');

    await cerebralTest.runSequence('submitAddPractitionerSequence');

    expect(Object.keys(cerebralTest.getState('validationErrors'))).toEqual([
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

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.phone',
      value: '111-111-1111',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'email',
      value: 'caroleBaskinH8r@example.com',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'month',
      value: '1',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'day',
      value: '1',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'year',
      value: '2010',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'birthYear',
      value: '1922',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'employer',
      value: 'Private',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'originalBarState',
      value: 'OK',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'practitionerType',
      value: 'Non-Attorney',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'firstName',
      value: `joe ${cerebralTest.currentTimestamp}`,
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'lastName',
      value: 'exotic tiger king',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: '123 Zoo St',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.city',
      value: 'Middle of Nowhere',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.state',
      value: 'OK',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.postalCode',
      value: '09876',
    });

    await cerebralTest.runSequence('submitAddPractitionerSequence');

    expect(Object.keys(cerebralTest.getState('validationErrors'))).toEqual([
      'confirmEmail',
    ]);

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'confirmEmail',
      value: 'caroleBaskinH8r@example.com',
    });

    await cerebralTest.runSequence('submitAddPractitionerSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    cerebralTest.barNumber = cerebralTest.getState(
      'practitionerDetail.barNumber',
    );
  });
};
