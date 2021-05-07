const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { IrsPractitioner } = require('../IrsPractitioner');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('updateIrsPractitioner', () => {
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

  it('updates the given irsPractitioner on the case', () => {
    const caseToVerify = new Case(
      {
        irsPractitioners: [
          new IrsPractitioner({
            email: 'irsPractitioner@example.com',
            userId: 'irsPractitioner',
          }),
        ],
      },
      {
        applicationContext,
      },
    );

    expect(caseToVerify.irsPractitioners).not.toBeNull();
    expect(caseToVerify.irsPractitioners[0].email).toEqual(
      'irsPractitioner@example.com',
    );

    caseToVerify.updateIrsPractitioner({
      email: 'irsPractitioner@example.com',
      userId: 'irsPractitioner',
    });
    expect(caseToVerify.irsPractitioners[0].email).toEqual(
      'irsPractitioner@example.com',
    );
  });

  it('updates a matching IRS practitioner found on the case', () => {
    expect(myCase.irsPractitioners.length).toEqual(1);

    myCase.updateIrsPractitioner({
      name: 'Christopher Running',
      userId: '123',
    });

    expect(myCase.irsPractitioners.length).toEqual(1);
    expect(myCase.irsPractitioners[0]).toMatchObject({
      name: 'Christopher Running',
    });
  });
  it('updates nothing when provided object does not match', () => {
    myCase.updateIrsPractitioner({
      name: 'Slow Jog',
      userId: '000-111-222',
    });

    expect(myCase.irsPractitioners.length).toEqual(1);
    expect(myCase.irsPractitioners[0]).toMatchObject({
      name: 'Christopher Walken',
    });
  });
});
