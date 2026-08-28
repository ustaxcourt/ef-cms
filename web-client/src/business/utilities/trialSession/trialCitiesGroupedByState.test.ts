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

  it('should exclude new trial cities when newTrialCitiesEnabled is false', () => {
    const citiesGrouped = getTrialCitiesGroupedByState({
      newTrialCitiesEnabled: false,
    });

    const allCityLabels = citiesGrouped.flatMap(group =>
      group.options.map(opt => opt.label),
    );

    expect(allCityLabels).not.toContain('Austin, Texas');
    expect(allCityLabels).not.toContain('Charlotte, North Carolina');
    expect(allCityLabels).not.toContain('Newark, New Jersey');
    expect(allCityLabels).not.toContain('Orlando, Florida');
    expect(allCityLabels).not.toContain('Sacramento, California');
  });

  it('should include new trial cities when newTrialCitiesEnabled is true', () => {
    const citiesGrouped = getTrialCitiesGroupedByState({
      newTrialCitiesEnabled: true,
    });

    const allCityLabels = citiesGrouped.flatMap(group =>
      group.options.map(opt => opt.label),
    );

    expect(allCityLabels).toContain('Austin, Texas');
    expect(allCityLabels).toContain('Charlotte, North Carolina');
    expect(allCityLabels).toContain('Newark, New Jersey');
    expect(allCityLabels).toContain('Orlando, Florida');
    expect(allCityLabels).toContain('Sacramento, California');
  });
});
