import { Case } from './Case';
import { mockAdmissionsClerkUser } from '@shared/test/mockAuthUsers';

describe('removeRepresentingFromPractitioners', () => {
  it('does not remove a practitioner if not found in the associated case privatePractioners array', () => {
    const caseToVerify = new Case(
      {
        privatePractitioners: [
          {
            representing: ['123', 'abc'],
          },
          {
            representing: ['ggg', '123'],
          },
          {
            representing: ['ggg'],
          },
        ],
      },
      {
        authorizedUser: mockAdmissionsClerkUser,
      },
    );

    caseToVerify.removeRepresentingFromPractitioners('123');
    expect(caseToVerify.privatePractitioners[0]).toMatchObject({
      representing: ['abc'],
    });
    expect(caseToVerify.privatePractitioners[1]).toMatchObject({
      representing: ['ggg'],
    });
    expect(caseToVerify.privatePractitioners[2]).toMatchObject({
      representing: ['ggg'],
    });
  });
});
