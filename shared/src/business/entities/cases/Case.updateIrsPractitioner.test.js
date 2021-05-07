const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { IrsPractitioner } = require('../IrsPractitioner');

describe('updateIrsPractitioner', () => {
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
});
