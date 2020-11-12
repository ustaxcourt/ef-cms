const faker = require('faker');
const { refreshElasticsearchIndex } = require('../helpers');

export const practitionerUpdatesAddress = test => {
  return it('practitioner updates address', async () => {
    await test.runSequence('gotoUserContactEditSequence');

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: '',
    });

    await test.runSequence('submitUpdateUserContactInformationSequence');

    expect(test.getState('validationErrors')).toEqual({
      contact: { address1: expect.anything() },
    });

    test.updatedPractitionerAddress = faker.address.streetAddress(true);

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: test.updatedPractitionerAddress,
    });

    await test.runSequence('submitUpdateUserContactInformationSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('userContactUpdateCompleteSequence');
    await refreshElasticsearchIndex(5000);
    expect(test.getState('alertSuccess')).toMatchObject({
      message: 'Changes saved.',
    });
  });
};
