import { getGroupedStateOptions } from '@web-client/business/utilities/groupStatesOptions';

describe('getGroupedStateOptions', () => {
  it('should return grouped state options', () => {
    const groupedStates = getGroupedStateOptions();

    expect(groupedStates).toHaveLength(3);

    expect(groupedStates[0]).toEqual(
      expect.objectContaining({
        label: '',
        options: expect.arrayContaining([
          expect.objectContaining({ label: 'N/A', value: 'N/A' }),
        ]),
      }),
    );

    expect(groupedStates[1]).toEqual(
      expect.objectContaining({
        label: 'States',
        options: expect.any(Array),
      }),
    );

    expect(groupedStates[2]).toEqual(
      expect.objectContaining({
        label: 'Other',
        options: expect.arrayContaining([
          expect.objectContaining({ label: 'Other', value: 'Other' }),
        ]),
      }),
    );
  });

  it('should list the state options in alphabetical order by full state name', () => {
    const stateLabels = getGroupedStateOptions()[1].options.map(
      option => option.label,
    );

    expect(stateLabels.slice(0, 5)).toEqual([
      'Alabama',
      'Alaska',
      'Arizona',
      'Arkansas',
      'California',
    ]);
    expect(stateLabels).toEqual(
      [...stateLabels].sort((firstLabel, secondLabel) =>
        firstLabel.localeCompare(secondLabel),
      ),
    );
  });
});
