const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { MOCK_CASE } = require('../../../test/mockCase');
const { PrivatePractitioner } = require('../PrivatePractitioner');

describe('updatePrivatePractitioner', () => {
  let myCase;

  beforeEach(() => {
    myCase = new Case(
      {
        ...MOCK_CASE,
        irsPractitioners: [{ name: 'Christopher Walken', userId: '123' }],
        privatePractitioners: [{ name: 'Slim Shady', userId: '567' }],
      },
      { applicationContext },
    );
  });

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

  it('updates a matching private practitioner found on the case', () => {
    expect(myCase.privatePractitioners.length).toEqual(1);

    myCase.updatePrivatePractitioner({
      name: 'Stout Sunny',
      userId: '567',
    });

    expect(myCase.privatePractitioners.length).toEqual(1);
    expect(myCase.privatePractitioners[0]).toMatchObject({
      name: 'Stout Sunny',
    });
  });
  it('updates nothing when provided object does not match', () => {
    myCase.updatePrivatePractitioner({
      name: 'Slow Jog',
      userId: '000-111-222',
    });

    expect(myCase.privatePractitioners.length).toEqual(1);
    expect(myCase.privatePractitioners[0]).toMatchObject({
      name: 'Slim Shady',
    });
  });
});
