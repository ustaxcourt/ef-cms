import { getClinicLetterKey } from './getClinicLetterKey';

describe('getClinicLetterKey', () => {
  it('should format clinic letter key correctly', () => {
    const result = getClinicLetterKey({
      procedureType: 'Regular',
      trialLocation: 'Detroit, Michigan',
    });

    expect(result).toEqual('clinic-letter-detroit-michigan-regular');
  });

  it('should format clinic letter key correctly for locations with multiple spaces', () => {
    const result = getClinicLetterKey({
      procedureType: 'Small',
      trialLocation: 'Los Angeles, New York',
    });

    expect(result).toEqual('clinic-letter-los-angeles-new-york-small');
  });

  describe('DAW-10170 new trial cities', () => {
    it.each([
      ['Austin, Texas', 'Regular', 'clinic-letter-austin-texas-regular'],
      ['Austin, Texas', 'Small', 'clinic-letter-austin-texas-small'],
      [
        'Charlotte, North Carolina',
        'Regular',
        'clinic-letter-charlotte-north-carolina-regular',
      ],
      [
        'Charlotte, North Carolina',
        'Small',
        'clinic-letter-charlotte-north-carolina-small',
      ],
      [
        'Newark, New Jersey',
        'Regular',
        'clinic-letter-newark-new-jersey-regular',
      ],
      ['Newark, New Jersey', 'Small', 'clinic-letter-newark-new-jersey-small'],
      ['Orlando, Florida', 'Regular', 'clinic-letter-orlando-florida-regular'],
      ['Orlando, Florida', 'Small', 'clinic-letter-orlando-florida-small'],
      [
        'Sacramento, California',
        'Regular',
        'clinic-letter-sacramento-california-regular',
      ],
      [
        'Sacramento, California',
        'Small',
        'clinic-letter-sacramento-california-small',
      ],
    ])(
      'derives the expected clinic-letter S3 key for %s (%s)',
      (trialLocation, procedureType, expectedKey) => {
        expect(getClinicLetterKey({ procedureType, trialLocation })).toEqual(
          expectedKey,
        );
      },
    );
  });
});
