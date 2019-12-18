const { User } = require('../../entities/User');
const { userIsAssociated } = require('./userIsAssociatedInteractor');

describe('userIsAssociated', () => {
  const applicationContext = {};

  it('returns true if the user.userId matches the case.userId', () => {
    const caseDetail = {
      practitioners: [],
      userId: 'abc-123',
    };
    const user = {
      role: User.ROLES.practitioner,
      userId: 'abc-123',
    };

    const result = userIsAssociated({ applicationContext, caseDetail, user });

    expect(result).toEqual(true);
  });

  it('returns true if the user.userId matches the corresponding role', () => {
    const caseDetail = {
      practitioners: [
        {
          userId: 'abc-123',
        },
      ],
      userId: 'def-321',
    };
    const user = {
      role: User.ROLES.practitioner,
      userId: 'abc-123',
    };

    const result = userIsAssociated({ applicationContext, caseDetail, user });
    expect(result).toEqual(true);

    user.role = User.ROLES.practitioner;
    caseDetail.respondents = [{ userId: 'abc-123' }];

    const result2 = userIsAssociated({ applicationContext, caseDetail, user });
    expect(result2).toEqual(true);
  });

  it('returns false if there are no associations between the user and the case', () => {
    const caseDetail = {
      practitioners: [
        {
          userId: 'noop-123',
        },
      ],
      userId: 'def-321',
    };
    const user = {
      role: User.ROLES.practitioner,
      userId: 'abc-123',
    };

    const result = userIsAssociated({ applicationContext, caseDetail, user });
    expect(result).toEqual(false);
  });

  it('returns false if the user role is not a practitioner or respondent', () => {
    const caseDetail = {
      practitioners: [],
      userId: 'def-321',
    };
    const user = {
      role: User.ROLES.docketClerk,
      userId: 'abc-123',
    };

    const result = userIsAssociated({ applicationContext, caseDetail, user });
    expect(result).toEqual(false);
  });
});
