import { getClinicLetterKey } from './getClinicLetterKey';

describe('getClinicLetterKey', () => {
  it('should format clinic letter key correctly', () => {
    const result = getClinicLetterKey({
      procedureType: 'Regular',
      trialLocation: 'Detroit, Michigan',
    });

    expect(result).toMatch('Detroit-Michigan-Regular');
  });

  it('should format clinic letter key correctly for locations with multiple spaces', () => {
    const result = getClinicLetterKey({
      procedureType: 'Small',
      trialLocation: 'Los Angeles, New York',
    });

    expect(result).toMatch('Los-Angeles-New-York-Small');
  });
});
