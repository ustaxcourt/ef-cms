import { getGroupedStateOptions } from '@shared/business/utilities/groupStatesOptions';

describe('getGroupedStateOptions', () => {
  it('should return grouped state options', () => {
    const groupedStates = getGroupedStateOptions();

    expect(groupedStates).toHaveLength(2);

    expect(groupedStates[0]).toEqual(
      expect.objectContaining({
        label: 'States',
        options: expect.any(Array),
      }),
    );

    expect(groupedStates[1]).toEqual(
      expect.objectContaining({
        label: 'Other',
        options: expect.arrayContaining([
          expect.objectContaining({ label: 'Other', value: 'Other' }),
        ]),
      }),
    );
  });
});
