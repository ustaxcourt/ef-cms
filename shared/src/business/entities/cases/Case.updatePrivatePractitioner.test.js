const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { PrivatePractitioner } = require('../PrivatePractitioner');

describe('updatePrivatePractitioner', () => {
  it('updates the given practitioner on the case', () => {
    const caseToVerify = new Case(
      {
        privatePractitioners: [
          new PrivatePractitioner({
            representing: ['182e1a2c-0252-4d76-8590-593324efaee3'],
            userId: 'privatePractitioner',
          }),
        ],
      },
      {
        applicationContext,
      },
    );

    expect(caseToVerify.privatePractitioners).not.toBeNull();
    expect(caseToVerify.privatePractitioners[0].representing).toEqual([
      '182e1a2c-0252-4d76-8590-593324efaee3',
    ]);

    caseToVerify.updatePrivatePractitioner({
      representing: [],
      userId: 'privatePractitioner',
    });
    expect(caseToVerify.privatePractitioners[0].representing).toEqual([]);
  });
});
