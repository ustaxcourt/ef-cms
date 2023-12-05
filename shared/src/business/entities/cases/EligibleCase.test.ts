import { EligibleCase } from './EligibleCase';
import { MOCK_CASE_WITH_SECONDARY_OTHERS } from '../../../test/mockCase';
import { MOCK_COMPLEX_CASE } from '../../../test/mockComplexCase';

describe('EligibleCase', () => {
  it('allowlists the fields set within the entity, removing those not defined', () => {
    const eligibleCase = new EligibleCase(MOCK_CASE_WITH_SECONDARY_OTHERS);

    expect(eligibleCase.getFormattedValidationErrors()).toBe(null);
    expect((eligibleCase as any).docketEntries).toBeUndefined();
    expect(eligibleCase.irsPractitioners!.length).toEqual(0);
  });

  it('retains irsPractitioners and privatePractitioners', () => {
    const eligibleCase = new EligibleCase(MOCK_COMPLEX_CASE);

    expect(eligibleCase.irsPractitioners!.length).toBeTruthy();
    expect(eligibleCase.privatePractitioners!.length).toEqual(0);
  });

  it('creates the docketNumberWithSuffix field correctly', () => {
    const eligibleCase = new EligibleCase({
      ...MOCK_CASE_WITH_SECONDARY_OTHERS,
      docketNumberSuffix: 'S',
    });

    expect(eligibleCase.getFormattedValidationErrors()).toBe(null);
    expect(eligibleCase.docketNumberWithSuffix).toBe('109-19S');
  });
});
