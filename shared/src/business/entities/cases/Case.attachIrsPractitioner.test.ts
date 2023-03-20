const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { IrsPractitioner } = require('../IrsPractitioner');

describe('attachIrsPractitioner', () => {
  it('adds the user to the irsPractitioners', () => {
    const caseToVerify = new Case(
      {},
      {
        applicationContext,
      },
    );
    caseToVerify.attachIrsPractitioner(
      new IrsPractitioner({
        userId: 'irsPractitioner',
      }),
    );

    expect(caseToVerify.irsPractitioners).not.toBeNull();
    expect(caseToVerify.irsPractitioners[0].userId).toEqual('irsPractitioner');
  });
});
