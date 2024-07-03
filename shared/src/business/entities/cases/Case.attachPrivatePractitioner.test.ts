import { Case } from './Case';
import { PrivatePractitioner } from '../PrivatePractitioner';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('attachPrivatePractitioner', () => {
  it('adds the user to the privatePractitioners', () => {
    const caseToVerify = new Case(
      {},
      {
        authorizedUser: mockDocketClerkUser,
      },
    );
    caseToVerify.attachPrivatePractitioner(
      new PrivatePractitioner({
        userId: 'privatePractitioner',
      }),
    );
    expect(caseToVerify.privatePractitioners).not.toBeNull();
    expect(caseToVerify.privatePractitioners[0].userId).toEqual(
      'privatePractitioner',
    );
  });
});
