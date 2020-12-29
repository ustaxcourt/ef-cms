const faker = require('faker');
const { refreshElasticsearchIndex } = require('../helpers');

export const practitionerUpdatesAddress = test => {
  return it('practitioner updates address', async () => {
    console.log('practitioner updates address');

    await test.runSequence('gotoUserContactEditSequence');

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: '',
    });

    await test.runSequence('submitUpdateUserContactInformationSequence');
    console.log('after submitUpdateUserContactInformationSequence');
    expect(test.getState('validationErrors')).toEqual({
      contact: { address1: expect.anything() },
    });

    test.updatedPractitionerAddress = faker.address.streetAddress(true);

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: test.updatedPractitionerAddress,
    });

    await test.runSequence('submitUpdateUserContactInformationSequence');
    console.log('after submitUpdateUserContactInformationSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('userContactUpdateCompleteSequence');
    console.log('after userContactUpdateCompleteSequence');

    await refreshElasticsearchIndex(5000);
    console.log('after refreshElasticsearchIndex');

    expect(test.getState('alertSuccess')).toMatchObject({
      message: 'Changes saved.',
    });
  });
};
