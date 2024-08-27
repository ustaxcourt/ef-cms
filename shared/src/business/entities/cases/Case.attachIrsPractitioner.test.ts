import { Case } from './Case';
import { IrsPractitioner } from '../IrsPractitioner';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('attachIrsPractitioner', () => {
  it('adds the user to the irsPractitioners', () => {
    const caseToVerify = new Case(
      {},
      {
        authorizedUser: mockDocketClerkUser,
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
