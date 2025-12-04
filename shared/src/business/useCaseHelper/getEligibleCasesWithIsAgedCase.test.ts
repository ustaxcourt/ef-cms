import { MOCK_CASE } from '@shared/test/mockCase';
import { CASE_STATUS_TYPES } from '../entities/EntityConstants';
import { getEligibleCasesWithIsAgedCase } from './getEligibleCasesWithIsAgedCase';
import { MOCK_ANSWER, MOCK_PETITION } from '@shared/test/mockDocketEntry';

describe('getEligibleCasesWithIsAgedCase', () => {
  it('should set isAgedCase to true for cases with no docket entries for a year', () => {
    const eligibleCases: RawCase[] = [
      {
        ...MOCK_CASE,
        docketEntries: [
          { ...MOCK_PETITION, filingDate: '2024-09-20T05:00:00.000Z' },
          { ...MOCK_ANSWER, filingDate: '2024-09-30T05:00:00.000Z' },
        ],
        status: CASE_STATUS_TYPES.generalDocket,
      },
    ];
    const result = getEligibleCasesWithIsAgedCase(eligibleCases);
    expect(result[0].isAgedCase).toBe(true);
  });
  it('should set isAgedCase to false for closed cases', () => {
    const eligibleCases: RawCase[] = [
      { ...MOCK_CASE, status: CASE_STATUS_TYPES.closed },
    ];
    const result = getEligibleCasesWithIsAgedCase(eligibleCases);
    expect(result[0].isAgedCase).toBe(false);
  });
  it('should habdle docket entries with no filing dates', () => {
    const eligibleCases: RawCase[] = [
      { ...MOCK_CASE, docketEntries: [{ ...MOCK_PETITION, filingDate: '' }] },
    ];
    const result = getEligibleCasesWithIsAgedCase(eligibleCases);
    expect(result[0].isAgedCase).toBe(false);
  });
  it('should handle if there are no docket entries', () => {
    const eligibleCases: RawCase[] = [{ ...MOCK_CASE, docketEntries: [] }];
    const result = getEligibleCasesWithIsAgedCase(eligibleCases);
    expect(result[0].isAgedCase).toBe(false);
  });
});
