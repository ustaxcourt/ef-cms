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
        options: expect.any(Array),
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

  it('should list the territory options in alphabetical order by full territory name', () => {
    const territoryLabels = getGroupedStateOptions()[2].options.map(
      option => option.label,
    );

    expect(territoryLabels).toEqual([
      'American Samoa',
      'Armed Forces Americas',
      'Armed Forces Europe',
      'Armed Forces Pacific',
      'Federated States of Micronesia',
      'Guam',
      'Marshall Islands',
      'Northern Mariana Islands',
      'Palau',
      'Puerto Rico',
      'Virgin Islands',
      'Other',
    ]);
    // Other needs to be on the bottom, so just check the actual territories
    expect(territoryLabels.slice(0, -1)).toEqual(
      [...territoryLabels.slice(0, -1)].sort((firstLabel, secondLabel) =>
        firstLabel.localeCompare(secondLabel),
      ),
    );
  });
});
