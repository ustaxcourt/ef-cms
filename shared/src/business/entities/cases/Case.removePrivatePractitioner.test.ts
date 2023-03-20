const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { PrivatePractitioner } = require('../PrivatePractitioner');

describe('removePrivatePractitioner', () => {
  it('does not remove a practitioner if not found in the associated case privatePractioners array', () => {
    const caseToVerify = new Case(
      {
        privatePractitioners: [
          new PrivatePractitioner({ userId: 'privatePractitioner1' }),
          new PrivatePractitioner({ userId: 'privatePractitioner2' }),
          new PrivatePractitioner({ userId: 'privatePractitioner3' }),
        ],
      },
      {
        applicationContext,
      },
    );

    expect(caseToVerify.privatePractitioners.length).toEqual(3);

    caseToVerify.removePrivatePractitioner({
      userId: 'privatePractitioner99',
    });
    expect(caseToVerify.privatePractitioners.length).toEqual(3);
  });
  it('removes the user from associated case privatePractitioners array', () => {
    const caseToVerify = new Case(
      {
        privatePractitioners: [
          new PrivatePractitioner({ userId: 'privatePractitioner1' }),
          new PrivatePractitioner({ userId: 'privatePractitioner2' }),
          new PrivatePractitioner({ userId: 'privatePractitioner3' }),
        ],
      },
      {
        applicationContext,
      },
    );

    expect(caseToVerify.privatePractitioners).not.toBeNull();
    expect(caseToVerify.privatePractitioners.length).toEqual(3);

    caseToVerify.removePrivatePractitioner({
      userId: 'privatePractitioner2',
    });
    expect(caseToVerify.privatePractitioners.length).toEqual(2);
    expect(
      caseToVerify.privatePractitioners.find(
        practitioner => practitioner.userId === 'privatePractitioner2',
      ),
    ).toBeFalsy();
  });
});
