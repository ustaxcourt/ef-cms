import { getTrialCitiesGroupedByState } from '@web-client/business/utilities/trialSession/trialCitiesGroupedByState';

describe('getTrialCitiesGroupedByState', () => {
  it('should return trial cities grouped by state', () => {
    const citiesGrouped = getTrialCitiesGroupedByState();
    expect(citiesGrouped).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: 'Alabama',
          options: expect.arrayContaining([
            expect.objectContaining({
              label: 'Birmingham, Alabama',
              value: 'Birmingham, Alabama',
            }),
            expect.objectContaining({
              label: 'Mobile, Alabama',
              value: 'Mobile, Alabama',
            }),
          ]),
        }),
      ]),
    );
  });

  it('should include the DAW-10170 trial cities by default (newTrialCitiesEnabled is true by default)', () => {
    const citiesGrouped = getTrialCitiesGroupedByState();
    const flattened = citiesGrouped.flatMap(group =>
      group.options.map(option => option.value),
    );

    expect(flattened).toEqual(
      expect.arrayContaining([
        'Austin, Texas',
        'Charlotte, North Carolina',
        'Newark, New Jersey',
        'Orlando, Florida',
        'Sacramento, California',
      ]),
    );
  });

  it('should include the DAW-10170 trial cities when newTrialCitiesEnabled is explicitly true', () => {
    const citiesGrouped = getTrialCitiesGroupedByState({
      newTrialCitiesEnabled: true,
    });
    const flattened = citiesGrouped.flatMap(group =>
      group.options.map(option => option.value),
    );

    expect(flattened).toEqual(
      expect.arrayContaining([
        'Austin, Texas',
        'Charlotte, North Carolina',
        'Newark, New Jersey',
        'Orlando, Florida',
        'Sacramento, California',
      ]),
    );
  });

  it('should exclude the DAW-10170 trial cities when newTrialCitiesEnabled is false', () => {
    const citiesGrouped = getTrialCitiesGroupedByState({
      newTrialCitiesEnabled: false,
    });
    const flattened = citiesGrouped.flatMap(group =>
      group.options.map(option => option.value),
    );

    expect(flattened).not.toEqual(
      expect.arrayContaining([
        'Austin, Texas',
        'Charlotte, North Carolina',
        'Newark, New Jersey',
        'Orlando, Florida',
        'Sacramento, California',
      ]),
    );
  });

  it('should preserve the pre-DAW-10170 California options (Fresno, Los Angeles, San Diego, San Francisco) when newTrialCitiesEnabled is false', () => {
    const citiesGrouped = getTrialCitiesGroupedByState({
      newTrialCitiesEnabled: false,
    });

    const californiaGroup = citiesGrouped.find(
      group => group.label === 'California',
    );

    expect(californiaGroup).toBeDefined();
    expect(californiaGroup!.options.map(option => option.value)).toEqual([
      'Fresno, California',
      'Los Angeles, California',
      'San Diego, California',
      'San Francisco, California',
    ]);
  });

  it('should omit the New Jersey group entirely when newTrialCitiesEnabled is false (Newark is the only NJ city)', () => {
    const citiesGrouped = getTrialCitiesGroupedByState({
      newTrialCitiesEnabled: false,
    });

    const newJerseyGroup = citiesGrouped.find(
      group => group.label === 'New Jersey',
    );

    expect(newJerseyGroup).toBeUndefined();
  });
});
