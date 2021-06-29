const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { IrsPractitioner } = require('../IrsPractitioner');

describe('removeIrsPractitioner', () => {
  it('does not remove a practitioner if not found in irsPractitioners array', () => {
    const caseToVerify = new Case(
      {
        irsPractitioners: [
          new IrsPractitioner({ userId: 'irsPractitioner1' }),
          new IrsPractitioner({ userId: 'irsPractitioner2' }),
          new IrsPractitioner({ userId: 'irsPractitioner3' }),
        ],
      },
      {
        applicationContext,
      },
    );

    expect(caseToVerify.irsPractitioners.length).toEqual(3);

    caseToVerify.removeIrsPractitioner({ userId: 'irsPractitioner99' });
    expect(caseToVerify.irsPractitioners.length).toEqual(3);
  });

  it('removes the user from associated case irsPractitioners array', () => {
    const caseToVerify = new Case(
      {
        irsPractitioners: [
          new IrsPractitioner({ userId: 'irsPractitioner1' }),
          new IrsPractitioner({ userId: 'irsPractitioner2' }),
          new IrsPractitioner({ userId: 'irsPractitioner3' }),
        ],
      },
      {
        applicationContext,
      },
    );

    expect(caseToVerify.irsPractitioners).not.toBeNull();
    expect(caseToVerify.irsPractitioners.length).toEqual(3);

    caseToVerify.removeIrsPractitioner({ userId: 'irsPractitioner2' });
    expect(caseToVerify.irsPractitioners.length).toEqual(2);
    expect(
      caseToVerify.irsPractitioners.find(
        practitioner => practitioner.userId === 'irsPractitioner2',
      ),
    ).toBeFalsy();
  });
});
