const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { ROLES } = require('../../entities/EntityConstants');
const { userIsAssociated } = require('./userIsAssociatedInteractor');

describe('userIsAssociated', () => {
  it('returns true if the user.userId matches the case.userId', () => {
    const caseDetail = {
      privatePractitioners: [],
      userId: 'abc-123',
    };
    const user = {
      role: ROLES.privatePractitioner,
      userId: 'abc-123',
    };

    const result = userIsAssociated({ applicationContext, caseDetail, user });

    expect(result).toEqual(true);
  });

  it('returns true if the user.userId matches the corresponding role', () => {
    const caseDetail = {
      privatePractitioners: [
        {
          userId: 'abc-123',
        },
      ],
      userId: 'def-321',
    };
    const user = {
      role: ROLES.privatePractitioner,
      userId: 'abc-123',
    };

    const result = userIsAssociated({ applicationContext, caseDetail, user });
    expect(result).toEqual(true);

    user.role = ROLES.privatePractitioner;
    caseDetail.irsPractitioners = [{ userId: 'abc-123' }];

    const result2 = userIsAssociated({ applicationContext, caseDetail, user });
    expect(result2).toEqual(true);
  });

  it('returns false if there are no associations between the user and the case', () => {
    const caseDetail = {
      privatePractitioners: [
        {
          userId: 'noop-123',
        },
      ],
      userId: 'def-321',
    };
    const user = {
      role: ROLES.privatePractitioner,
      userId: 'abc-123',
    };

    const result = userIsAssociated({ applicationContext, caseDetail, user });
    expect(result).toEqual(false);
  });

  it('returns false if the user role is not a privatePractitioner or irsPractitioner', () => {
    const caseDetail = {
      privatePractitioners: [],
      userId: 'def-321',
    };
    const user = {
      role: ROLES.docketClerk,
      userId: 'abc-123',
    };

    const result = userIsAssociated({ applicationContext, caseDetail, user });
    expect(result).toEqual(false);
  });
});
