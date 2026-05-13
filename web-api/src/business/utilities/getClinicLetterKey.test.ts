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
});
