const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case, isUserIdRepresentedByPrivatePractitioner } = require('./Case');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('isUserIdRepresentedByPrivatePractitioner', () => {
  let caseEntity;

  beforeAll(() => {
    caseEntity = new Case(
      {
        ...MOCK_CASE,
        privatePractitioners: [
          {
            barNumber: 'PP123',
            representing: ['123'],
          },
          {
            barNumber: 'PP234',
            representing: ['234', '456'],
          },
        ],
      },
      {
        applicationContext,
      },
    );
  });

  it('returns true if there is a privatePractitioner representing the given userId', () => {
    expect(caseEntity.isUserIdRepresentedByPrivatePractitioner('456')).toEqual(
      true,
    );
  });

  it('returns false if there is NO privatePractitioner representing the given userId', () => {
    expect(caseEntity.isUserIdRepresentedByPrivatePractitioner('678')).toEqual(
      false,
    );
  });

  it('returns true if there is a privatePractitioner representing the given userId', () => {
    expect(
      isUserIdRepresentedByPrivatePractitioner(caseEntity.toRawObject(), '456'),
    ).toEqual(true);
  });

  it('returns false if there is NO privatePractitioner representing the given userId', () => {
    expect(
      isUserIdRepresentedByPrivatePractitioner(caseEntity.toRawObject(), '789'),
    ).toEqual(false);
  });
});
