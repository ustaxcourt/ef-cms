const { isPetitionerPartOfGroup } = require('./Case');

describe('isPetitionerPartOfGroup', () => {
  it('should return true when the userId exists in the petitioners', () => {
    const isPartOfCase = isPetitionerPartOfGroup({
      consolidatedCases: [
        {
          irsPractitioners: [],
          petitioners: [{ contactId: 'abc' }],
          privatePractitioners: [],
        },
      ],
      userId: 'abc',
    });

    expect(isPartOfCase).toBe(true);
  });

  it('should return false when the userId does not exist in a consolidated cases parties array', () => {
    const isPartOfCase = isPetitionerPartOfGroup({
      consolidatedCases: [
        {
          irsPractitioners: [],
          petitioners: [{ contactId: '1' }],
          privatePractitioners: [],
        },
        {
          irsPractitioners: [],
          petitioners: [{ contactId: '2' }],
          privatePractitioners: [],
        },
      ],
      userId: 'abc',
    });

    expect(isPartOfCase).toBe(false);
  });

  it('should return true when the userId exists in the privatePractitioners', () => {
    const isPartOfCase = isPetitionerPartOfGroup({
      consolidatedCases: [
        {
          irsPractitioners: [],
          petitioners: [{ contactId: 'xyz' }],
          privatePractitioners: [{ userId: 'abc' }],
        },
      ],
      userId: 'abc',
    });

    expect(isPartOfCase).toBe(true);
  });

  it('should return true when the userId exists in the irsPractitioners', () => {
    const isPartOfCase = isPetitionerPartOfGroup({
      consolidatedCases: [
        {
          irsPractitioners: [],
          petitioners: [{ contactId: 'xyz' }],
          privatePractitioners: [{ userId: 'abc' }],
        },
      ],
      userId: 'abc',
    });

    expect(isPartOfCase).toBe(true);
  });
});
