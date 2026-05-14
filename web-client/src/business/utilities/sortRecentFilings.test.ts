import { sortRecentFilings } from './sortRecentFilings';
import { RecentFiling } from '@shared/business/useCases/getRecentFilingsForUserInteractor';

const createFiling = (overrides: Partial<RecentFiling> = {}): RecentFiling => ({
  docketNumber: '101-20',
  filedDate: '2024-01-15',
  document: 'Petition',
  caseTitle: 'Test Case',
  docketEntryId: '1',
  status: 'new',
  ...overrides,
});

const testFilings = [
  createFiling({
    filedDate: '2024-01-20',
    docketNumber: '103-20',
    document: 'Motion',
  }),
  createFiling({
    filedDate: '2024-01-10',
    docketNumber: '102-20',
    document: 'Answer',
  }),
  createFiling(),
];

describe('sortRecentFilings', () => {
  it('should handle empty/null inputs', () => {
    expect(sortRecentFilings([])).toEqual([]);
    expect(sortRecentFilings(null as any)).toEqual([]);
    expect(sortRecentFilings(undefined as any)).toEqual([]);
  });

  it('should sort by filedDate desc by default', () => {
    const result = sortRecentFilings(testFilings);
    expect(result[0].filedDate).toBe('2024-01-20');
    expect(result[2].filedDate).toBe('2024-01-10');
  });

  it('should sort by different fields and orders', () => {
    const result = sortRecentFilings(testFilings, 'document', 'asc');
    expect(result[0].document).toBe('Answer');
    expect(result[2].document).toBe('Petition');
  });

  it('should handle docket number sorting with invalid formats', () => {
    const filings = [
      createFiling({ docketNumber: '101-20' }),
      createFiling({ docketNumber: '102-20' }),
    ];
    const result = sortRecentFilings(filings, 'docketNumber', 'asc');
    expect(result[0].docketNumber).toBe('101-20');
    expect(result[1].docketNumber).toBe('102-20');
  });

  it('should handle null/empty document values', () => {
    const filings = [
      createFiling({ document: null as any }),
      createFiling({ document: '' }),
      createFiling({ document: 'Test' }),
    ];
    const result = sortRecentFilings(filings, 'document', 'asc');
    expect(result[0].document).toBe('');
    expect(result[1].document).toBe('Test');
    expect(result[2].document).toBeNull();
  });

  it('should fallback to filedDate when primary sort values are equal', () => {
    const filings = [
      createFiling({ filedDate: '2024-01-15' }),
      createFiling({ filedDate: '2024-01-10' }),
    ];
    const result = sortRecentFilings(filings, 'document', 'asc');
    expect(result[0].filedDate).toBe('2024-01-15');
  });

  it('should handle invalid sort parameters gracefully', () => {
    const result = sortRecentFilings(
      testFilings,
      'invalid' as any,
      'invalid' as any,
    );
    expect(result[0].filedDate).toBe('2024-01-20'); // Defaults to filedDate desc
  });

  it('should handle case-insensitive sorting', () => {
    const filings = [
      createFiling({ document: 'petition', caseTitle: 'test case' }),
      createFiling({ document: 'MOTION', caseTitle: 'TEST CASE' }),
      createFiling({ document: 'Answer', caseTitle: 'Test Case' }),
    ];
    const result = sortRecentFilings(filings, 'document', 'asc');
    expect(result[0].document).toBe('Answer');
    expect(result[1].document).toBe('MOTION');
    expect(result[2].document).toBe('petition');
  });

  it('should handle case-insensitive case title sorting', () => {
    const filings = [
      createFiling({ caseTitle: 'test case' }),
      createFiling({ caseTitle: 'TEST CASE' }),
      createFiling({ caseTitle: 'Test Case' }),
    ];
    const result = sortRecentFilings(filings, 'caseTitle', 'asc');
    expect(result[0].caseTitle).toBe('test case');
    expect(result[1].caseTitle).toBe('TEST CASE');
    expect(result[2].caseTitle).toBe('Test Case');
  });

  it('should handle filedDate asc sorting', () => {
    const result = sortRecentFilings(testFilings, 'filedDate', 'asc');
    expect(result[0].filedDate).toBe('2024-01-10');
    expect(result[2].filedDate).toBe('2024-01-20');
  });

  it('should handle docketNumber desc sorting', () => {
    const result = sortRecentFilings(testFilings, 'docketNumber', 'desc');
    expect(result[0].docketNumber).toBe('103-20');
    expect(result[2].docketNumber).toBe('101-20');
  });
});
