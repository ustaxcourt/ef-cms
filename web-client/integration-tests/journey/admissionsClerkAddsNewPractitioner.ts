import { FORMATS } from '@shared/business/utilities/DateHandler';
import { faker } from '@faker-js/faker';

export const admissionsClerkAddsNewPractitioner = (
  cerebralTest,
  email = `${faker.internet.userName()}@example.com`,
) => {
  return it('admissions clerk adds a new practitioner', async () => {
    cerebralTest.fakeName = faker.person.fullName();

    await cerebralTest.runSequence('gotoCreatePractitionerUserSequence');

    await cerebralTest.runSequence('submitAddPractitionerSequence');

    expect(Object.keys(cerebralTest.getState('validationErrors'))).toEqual([
      'phone',
      'email',
      'admissionsDate',
      'birthYear',
      'practiceType',
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
      value: email,
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'admissionsDate',
        toFormat: FORMATS.YYYYMMDD,
        value: '1/1/2010',
      },
    );

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'birthYear',
      value: '1922',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'practiceType',
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
      value: `joe ${cerebralTest.fakeName}`,
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
      value: email,
    });

    await cerebralTest.runSequence('submitAddPractitionerSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('alertError')).not.toBeDefined();

    cerebralTest.barNumber = cerebralTest.getState(
      'practitionerDetail.barNumber',
    );
  });
};
