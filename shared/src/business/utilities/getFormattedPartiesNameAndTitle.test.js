import { CONTACT_TYPE_TITLES } from '../entities/EntityConstants';
import { MOCK_CASE } from '../../test/mockCase';
import { getFormattedPartiesNameAndTitle } from './getFormattedPartiesNameAndTitle';

describe('getFormattedPartiesNameAndTitle', () => {
  const mockPetitioners = MOCK_CASE.petitioners;

  it('should return petitioners with a displayName containing contactType', () => {
    const result = getFormattedPartiesNameAndTitle({
      petitioners: mockPetitioners,
    });

    expect(result[0]).toEqual({
      ...mockPetitioners[0],
      displayName: `${mockPetitioners[0].name}, ${
        CONTACT_TYPE_TITLES[mockPetitioners[0].contactType]
      }`,
    });
  });

  it('should not throw an error when petitioners is undefined', () => {
    expect(() =>
      getFormattedPartiesNameAndTitle({
        petitioners: undefined,
      }),
    ).not.toThrow();
  });
});
