import { RestrictedCaseDTO } from './RestrictedCaseDTO';

describe('RestrictedCaseDTO', () => {
  it('maps a restricted raw case and removes served parties from docket entries', () => {
    const raw: RawRestrictedCase = {
      docketNumber: '101-20',
      docketNumberSuffix: 'S',
      isPaper: false,
      isSealed: undefined,
      leadDocketNumber: false,
      docketEntries: [],
    };

    const dto = new RestrictedCaseDTO(raw);

    expect(dto.entityName).toBe('RestrictedCaseDTO');
    expect(dto.docketNumber).toBe('101-20');
    expect(dto.docketNumberSuffix).toBe('S');
    expect(dto.docketEntries).toEqual([]);
  });
});
