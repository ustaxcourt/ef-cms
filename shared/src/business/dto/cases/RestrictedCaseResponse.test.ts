import { RestrictedCaseResponse } from './RestrictedCaseResponse';

describe('RestrictedCaseResponse', () => {
  it('maps a restricted raw case without docket entries', () => {
    const raw: RawRestrictedCase = {
      docketNumber: '101-20',
      docketNumberSuffix: 'S',
      isPaper: false,
      isSealed: undefined,
      leadDocketNumber: '101-20',
      docketEntries: [],
    };

    const dto = new RestrictedCaseResponse(raw);

    expect(dto.entityName).toBe('RestrictedCaseResponse');
    expect(dto.docketNumber).toBe('101-20');
    expect(dto.docketNumberSuffix).toBe('S');
    expect(dto.docketNumberWithSuffix).toBe('101-20S');
    expect(dto.docketEntries).toEqual([]);
  });

  it('rejects docket entries if they are added to the public DTO', () => {
    const dto = new RestrictedCaseResponse({
      docketNumber: '101-20',
      docketEntries: [],
    });
    Object.assign(dto, { docketEntries: [{}] });

    expect(dto.isValid()).toBe(false);
    expect(dto.getValidationErrors()).toEqual(
      expect.objectContaining({
        docketEntries: expect.any(String),
      }),
    );
  });
});
