import { userIsDirectlyAssociated } from '@shared/business/entities/cases/Case';

describe('userIsDirectlyAssociated', () => {
  const aCase = {
    petitioners: [
      {
        userId: '123',
        contactId: 'abc',
      },
    ],
    privatePractitioners: [
      {
        userId: '456',
        contactId: 'def',
      },
    ],
    irsPractitioners: [
      {
        userId: '789',
        contactId: 'ghi',
      },
    ],
  };

  it('should return false if no userId is provided', () => {
    const result = userIsDirectlyAssociated({
      aCase,
      userId: undefined,
    });

    expect(result).toEqual(false);
  });
  it('should return false if user id is not directly associated', () => {
    const result = userIsDirectlyAssociated({
      aCase,
      userId: 'not',
    });

    expect(result).toEqual(false);
  });
  it('should return true if user is a petitioner linked on userId', () => {
    const result = userIsDirectlyAssociated({
      aCase,
      userId: '123',
    });

    expect(result).toEqual(true);
  });
  it('should return true if user is a petitioner linked on contactId', () => {
    const result = userIsDirectlyAssociated({
      aCase,
      userId: 'abc',
    });

    expect(result).toEqual(true);
  });
  it('should return true if user is a private practitioner linked on userId', () => {
    const result = userIsDirectlyAssociated({
      aCase,
      userId: '456',
    });

    expect(result).toEqual(true);
  });
  it('should return true if user is a private practitioner linked on contactId', () => {
    const result = userIsDirectlyAssociated({
      aCase,
      userId: 'def',
    });

    expect(result).toEqual(true);
  });
  it('should return true if user is an IRS practitioner linked on userId', () => {
    const result = userIsDirectlyAssociated({
      aCase,
      userId: '789',
    });

    expect(result).toEqual(true);
  });
  it('should return true if user is an IRS practitioner linked on contactId', () => {
    const result = userIsDirectlyAssociated({
      aCase,
      userId: 'ghi',
    });

    expect(result).toEqual(true);
  });
});
