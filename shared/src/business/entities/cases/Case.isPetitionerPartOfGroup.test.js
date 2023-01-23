const { getPetitionerById, isPetitionerPartOfGroup } = require('./Case');

describe('isPetitionerPartOfGroup', () => {
  it('should return true when the userId exists in a consolidated cases parties array', () => {
    const isPartOfCase = isPetitionerPartOfGroup({
      consolidatedCases: [
        {
          petitioners: [{ contactId: 'abc' }],
        },
      ],
      isPartyOfCase: getPetitionerById,
      userId: 'abc',
    });

    expect(isPartOfCase).toBe(true);
  });

  it('should return false when the userId does not exist in a consolidated cases parties array', () => {
    const isPartOfCase = isPetitionerPartOfGroup({
      consolidatedCases: [
        {
          petitioners: [{ contactId: '1' }],
        },
        {
          petitioners: [{ contactId: '2' }],
        },
      ],
      isPartyOfCase: getPetitionerById,
      userId: 'abc',
    });

    expect(isPartOfCase).toBe(false);
  });
});
