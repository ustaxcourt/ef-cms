import { getTrialCitiesGroupedByState } from '@shared/business/utilities/trialSession/trialCitiesGroupedByState';

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
});
