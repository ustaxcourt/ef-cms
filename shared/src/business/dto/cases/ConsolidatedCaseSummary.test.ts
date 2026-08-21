import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { ConsolidatedCaseSummary } from './ConsolidatedCaseSummary';

describe('ConsolidatedCaseSummary', () => {
  const raw = {
    automaticBlocked: false,
    blocked: false,
    caseCaption: 'Test Caption',
    docketNumber: '101-20',
    docketNumberWithSuffix: '101-20S',
    irsPractitioners: [{ name: 'IRS Rep' }],
    isSealed: false,
    leadDocketNumber: '102-21',
    petitioners: [{ name: 'Petitioner' }],
    privatePractitioners: [{ name: 'Private' }],
    sortableDocketNumber: 10120,
    status: CASE_STATUS_TYPES.calendared,
  };

  it('maps raw consolidated summary fields and defaults practitioner arrays', () => {
    const summary = new ConsolidatedCaseSummary({
      ...raw,
      irsPractitioners: undefined,
      petitioners: undefined,
      privatePractitioners: undefined,
    });

    expect(summary.caseCaption).toBe('Test Caption');
    expect(summary.docketNumber).toBe('101-20');
    expect(summary.irsPractitioners).toEqual([]);
    expect(summary.petitioners).toEqual([]);
    expect(summary.privatePractitioners).toEqual([]);
    expect(summary.status).toBe(CASE_STATUS_TYPES.calendared);
  });

  it('getFields returns property names from a blank instance', () => {
    const fields = ConsolidatedCaseSummary.getFields();
    expect(fields.length).toBeGreaterThan(0);
    expect(fields).toContain('caseCaption');
    expect(fields).toContain('docketNumber');
  });
});
