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

  it('should handle empty/null/undefined input gracefully', () => {
    expect(sortRecentFilings([])).toEqual([]);
    expect(sortRecentFilings(null as any)).toEqual([]);
    expect(sortRecentFilings(undefined as any)).toEqual([]);
  });

  it('should handle single item array', () => {
    const singleFiling = [mockFilings[0]];
    expect(sortRecentFilings(singleFiling)).toEqual(singleFiling);
    expect(sortRecentFilings(singleFiling, 'filedDate', 'desc')).toEqual(
      singleFiling,
    );
  });

  describe('Sort by different fields', () => {
    const sortTests = [
      {
        field: 'filedDate',
        order: 'asc',
        expected: ['2024-01-10', '2024-01-15', '2024-01-20'],
        property: 'filedDate',
      },
      {
        field: 'docketNumber',
        order: 'asc',
        expected: ['101-20', '102-20', '103-20'],
        property: 'docketNumber',
      },
      {
        field: 'docketNumber',
        order: 'desc',
        expected: ['103-20', '102-20', '101-20'],
        property: 'docketNumber',
      },
      {
        field: 'document',
        order: 'asc',
        expected: ['Answer', 'Motion', 'Petition'],
        property: 'document',
      },
      {
        field: 'document',
        order: 'desc',
        expected: ['Petition', 'Motion', 'Answer'],
        property: 'document',
      },
      {
        field: 'caseTitle',
        order: 'asc',
        expected: ['Test Case 1', 'Test Case 2', 'Test Case 3'],
        property: 'caseTitle',
      },
      {
        field: 'caseTitle',
        order: 'desc',
        expected: ['Test Case 3', 'Test Case 2', 'Test Case 1'],
        property: 'caseTitle',
      },
    ];

    it.each(sortTests)(
      'should sort by $field $order correctly',
      ({ field, order, expected, property }) => {
        const result = sortRecentFilings(
          mockFilings,
          field as any,
          order as any,
        );
        expected.forEach((value, index) => {
          expect(result[index][property as keyof RecentFiling]).toBe(value);
        });
      },
    );
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

    const result = sortRecentFilings(
      filingsWithSameDocument,
      'document',
      'asc',
    );
    expect(result[0].filedDate).toBe('2024-01-15');
    expect(result[1].filedDate).toBe('2024-01-10');
  });

  it('should handle filings with missing/null values', () => {
    const filingsWithMissingFields: RecentFiling[] = [
      {
        docketNumber: '101-20',
        filedDate: '2024-01-15',
        document: '',
        caseTitle: '',
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
        document: null as any,
        caseTitle: null as any,
        docketEntryId: '3',
      },
    ];

    const result = sortRecentFilings(
      filingsWithMissingFields,
      'document',
      'asc',
    );
    expect(result[0].docketNumber).toBe('101-20'); // Empty string should come first
    expect(result[1].docketNumber).toBe('102-20'); // Answer should come second
    expect(result[2].docketNumber).toBe('103-20'); // null should come last
  });

  it('should handle case-insensitive sorting for document and caseTitle fields', () => {
    const filingsWithMixedCase: RecentFiling[] = [
      {
        docketNumber: '101-20',
        filedDate: '2024-01-15',
        document: 'petition',
        caseTitle: 'test case 1',
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
        document: 'MOTION',
        caseTitle: 'TEST CASE 3',
        docketEntryId: '3',
      },
    ];

    const documentResult = sortRecentFilings(
      filingsWithMixedCase,
      'document',
      'asc',
    );
    expect(documentResult[0].document).toBe('Answer');
    expect(documentResult[1].document).toBe('MOTION');
    expect(documentResult[2].document).toBe('petition');

    const caseTitleResult = sortRecentFilings(
      filingsWithMixedCase,
      'caseTitle',
      'asc',
    );
    expect(caseTitleResult[0].caseTitle).toBe('test case 1');
    expect(caseTitleResult[1].caseTitle).toBe('Test Case 2');
    expect(caseTitleResult[2].caseTitle).toBe('TEST CASE 3');
  });

  it('should handle identical values with secondary sort', () => {
    const filingsWithIdenticalValues = [
      {
        docketNumber: '101-20',
        filedDate: '2024-01-15',
        document: 'Petition',
        caseTitle: 'Test Case 1',
        docketEntryId: '1',
      },
      {
        docketNumber: '101-20',
        filedDate: '2024-01-15',
        document: 'Petition',
        caseTitle: 'Test Case 1',
        docketEntryId: '2',
      },
    ];

    const result = sortRecentFilings(
      filingsWithIdenticalValues,
      'document',
      'asc',
    );
    expect(result[0].docketEntryId).toBe('1');
    expect(result[1].docketEntryId).toBe('2');
  });

  describe('Parameter validation and defaults', () => {
    it('should handle undefined/null sort parameters by using defaults', () => {
      const undefinedFieldResult = sortRecentFilings(
        mockFilings,
        undefined as any,
        'desc',
      );
      const nullFieldResult = sortRecentFilings(
        mockFilings,
        null as any,
        'desc',
      );
      const undefinedOrderResult = sortRecentFilings(
        mockFilings,
        'filedDate',
        undefined as any,
      );
      const nullOrderResult = sortRecentFilings(
        mockFilings,
        'filedDate',
        null as any,
      );

      expect(undefinedFieldResult[0].filedDate).toBe('2024-01-20');
      expect(nullFieldResult[0].filedDate).toBe('2024-01-20');
      expect(undefinedOrderResult[0].filedDate).toBe('2024-01-20');
      expect(nullOrderResult[0].filedDate).toBe('2024-01-20');
    });

    it('should handle invalid sort parameters by using defaults', () => {
      const invalidFieldResult = sortRecentFilings(
        mockFilings,
        'invalidField' as any,
        'desc',
      );
      const invalidOrderResult = sortRecentFilings(
        mockFilings,
        'filedDate',
        'invalid' as any,
      );

      expect(invalidFieldResult[0].filedDate).toBe('2024-01-20');
      expect(invalidOrderResult[0].filedDate).toBe('2024-01-20');
    });
  });
});
