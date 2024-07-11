import { Case } from '@shared/business/entities/cases/Case';
import { MOCK_CASE } from '@shared/test/mockCase';
import { irsPractitionerUser } from '@shared/test/mockUsers';

describe('isFirstIrsFiling', () => {
  it('returns true if not sealed and no IRS practitioners', () => {
    const result = Case.isFirstIrsFiling({
      ...MOCK_CASE,
      docketEntries: [],
      irsPractitioners: [],
      isSealed: false,
      sealedDate: undefined,
    });
    expect(result).toBe(true);
  });

  it('returns false if sealed and no IRS practitioners', () => {
    const result = Case.isFirstIrsFiling({
      ...MOCK_CASE,
      docketEntries: [],
      irsPractitioners: [],
      isSealed: true,
      sealedDate: undefined,
    });
    expect(result).toBe(false);
  });

  it('returns false if not sealed and has IRS practitioners', () => {
    const result = Case.isFirstIrsFiling({
      ...MOCK_CASE,
      docketEntries: [],
      irsPractitioners: [{ irsPractitioner: irsPractitionerUser }],
      isSealed: false,
      sealedDate: undefined,
    });
    expect(result).toBe(false);
  });
});
