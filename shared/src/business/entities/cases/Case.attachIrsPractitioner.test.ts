import { Case } from './Case';
import { IrsPractitioner } from '../IrsPractitioner';
import { applicationContext } from '../../test/createTestApplicationContext';

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
