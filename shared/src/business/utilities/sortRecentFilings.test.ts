import { sortRecentFilings } from './sortRecentFilings';
import { RecentFiling } from '@shared/business/entities/RecentFiling';

describe('sortRecentFilings', () => {
  const mockFilings: RecentFiling[] = [
    {
      docketNumber: '101-20',
      filedDate: '2024-01-15',
      document: 'Petition',
      caseTitle: 'Test Case 1',
      docketEntryId: '1',
    },
    {
      docketNumber: '102-20',
      filedDate: '2024-01-10',
      document: 'Answer',
      caseTitle: 'Test Case 2',
      docketEntryId: '2',
    },
    {
      docketNumber: '103-20',
      filedDate: '2024-01-20',
      document: 'Motion',
      caseTitle: 'Test Case 3',
      docketEntryId: '3',
    },
  ];

  it('should sort by filedDate descending by default', () => {
    const result = sortRecentFilings(mockFilings);
    
    expect(result[0].filedDate).toBe('2024-01-20');
    expect(result[1].filedDate).toBe('2024-01-15');
    expect(result[2].filedDate).toBe('2024-01-10');
  });

  it('should sort by filedDate ascending when specified', () => {
    const result = sortRecentFilings(mockFilings, 'filedDate', 'asc');
    
    expect(result[0].filedDate).toBe('2024-01-10');
    expect(result[1].filedDate).toBe('2024-01-15');
    expect(result[2].filedDate).toBe('2024-01-20');
  });

  it('should sort by docketNumber ascending', () => {
    const result = sortRecentFilings(mockFilings, 'docketNumber', 'asc');
    
    expect(result[0].docketNumber).toBe('101-20');
    expect(result[1].docketNumber).toBe('102-20');
    expect(result[2].docketNumber).toBe('103-20');
  });

  it('should sort by docketNumber descending', () => {
    const result = sortRecentFilings(mockFilings, 'docketNumber', 'desc');
    
    expect(result[0].docketNumber).toBe('103-20');
    expect(result[1].docketNumber).toBe('102-20');
    expect(result[2].docketNumber).toBe('101-20');
  });

  it('should sort by document alphabetically', () => {
    const result = sortRecentFilings(mockFilings, 'document', 'asc');
    
    expect(result[0].document).toBe('Answer');
    expect(result[1].document).toBe('Motion');
    expect(result[2].document).toBe('Petition');
  });

  it('should sort by caseTitle alphabetically', () => {
    const result = sortRecentFilings(mockFilings, 'caseTitle', 'asc');
    
    expect(result[0].caseTitle).toBe('Test Case 1');
    expect(result[1].caseTitle).toBe('Test Case 2');
    expect(result[2].caseTitle).toBe('Test Case 3');
  });

  it('should handle empty array', () => {
    const result = sortRecentFilings([]);
    expect(result).toEqual([]);
  });

  it('should handle null/undefined input', () => {
    const result = sortRecentFilings(null as any);
    expect(result).toEqual([]);
  });

  it('should use filedDate as secondary sort when primary sort results in tie', () => {
    const filingsWithSameDocument: RecentFiling[] = [
      {
        docketNumber: '101-20',
        filedDate: '2024-01-15',
        document: 'Motion',
        caseTitle: 'Test Case 1',
        docketEntryId: '1',
      },
      {
        docketNumber: '102-20',
        filedDate: '2024-01-10',
        document: 'Motion',
        caseTitle: 'Test Case 2',
        docketEntryId: '2',
      },
    ];

    const result = sortRecentFilings(filingsWithSameDocument, 'document', 'asc');
    
    // Should sort by document first, then by filedDate descending as secondary sort
    expect(result[0].filedDate).toBe('2024-01-15');
    expect(result[1].filedDate).toBe('2024-01-10');
  });
}); 