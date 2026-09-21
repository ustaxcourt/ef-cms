import React from 'react';
import {
  getActivePageIndexFromOneBasedPageQuery,
  getOneBasedPageForFilingFeeReturn,
  getPaginationResult,
  useClientSidePaginator,
} from './useClientSidePaginator';

jest.mock('react', () => {
  const actual = jest.requireActual<typeof import('react')>('react');
  return {
    ...actual,
    useEffect: jest.fn(),
    useState: jest.fn(),
  };
});

describe('getPaginationResult', () => {
  it('should calculate total pages and return the correct records for the first page', () => {
    const data = [1, 2, 3, 4, 5];
    const pageSize = 2;
    const activePage = 0;

    const result = getPaginationResult(data, pageSize, activePage);

    expect(result.totalPages).toBe(3);
    expect(result.pageRecords).toEqual([1, 2]);
  });

  it('should return the correct records for the second page', () => {
    const data = [1, 2, 3, 4, 5];
    const pageSize = 2;
    const activePage = 1;

    const result = getPaginationResult(data, pageSize, activePage);

    expect(result.totalPages).toBe(3);
    expect(result.pageRecords).toEqual([3, 4]);
  });

  it('should handle cases where the page size is larger than the dataset', () => {
    const data = [1, 2, 3];
    const pageSize = 10;
    const activePage = 0;

    const result = getPaginationResult(data, pageSize, activePage);

    expect(result.totalPages).toBe(1);
    expect(result.pageRecords).toEqual([1, 2, 3]);
  });

  it('should handle cases where the dataset is empty', () => {
    const data: number[] = [];
    const pageSize = 5;
    const activePage = 0;

    const result = getPaginationResult(data, pageSize, activePage);

    expect(result.totalPages).toBe(0);
    expect(result.pageRecords).toEqual([]);
  });

  it('should return an empty array for an out-of-range active page', () => {
    const data = [1, 2, 3];
    const pageSize = 2;
    const activePage = 5;

    const result = getPaginationResult(data, pageSize, activePage);

    expect(result.totalPages).toBe(2);
    expect(result.pageRecords).toEqual([]);
  });

  it('should correctly handle a dataset where total records equal one page', () => {
    const data = [1, 2, 3];
    const pageSize = 3;
    const activePage = 0;

    const result = getPaginationResult(data, pageSize, activePage);

    expect(result.totalPages).toBe(1);
    expect(result.pageRecords).toEqual([1, 2, 3]);
  });

  it('should correctly handle a fractional last page', () => {
    const data = [1, 2, 3, 4, 5];
    const pageSize = 2;
    const activePage = 2;

    const result = getPaginationResult(data, pageSize, activePage);

    expect(result.totalPages).toBe(3);
    expect(result.pageRecords).toEqual([5]);
  });
});

describe('getActivePageIndexFromOneBasedPageQuery', () => {
  it('should return 0 when the page query is absent', () => {
    expect(getActivePageIndexFromOneBasedPageQuery(undefined)).toBe(0);
    expect(getActivePageIndexFromOneBasedPageQuery(null)).toBe(0);
    expect(getActivePageIndexFromOneBasedPageQuery('')).toBe(0);
  });

  it('should return 0 when the page query is invalid', () => {
    expect(getActivePageIndexFromOneBasedPageQuery('abc')).toBe(0);
    expect(getActivePageIndexFromOneBasedPageQuery('0')).toBe(0);
    expect(getActivePageIndexFromOneBasedPageQuery('-1')).toBe(0);
  });

  it('should return 0 for the first one-based page', () => {
    expect(getActivePageIndexFromOneBasedPageQuery('1')).toBe(0);
  });

  it('should convert later one-based pages to zero-based indexes', () => {
    expect(getActivePageIndexFromOneBasedPageQuery('2')).toBe(1);
    expect(getActivePageIndexFromOneBasedPageQuery('3')).toBe(2);
  });
});

describe('getOneBasedPageForFilingFeeReturn', () => {
  it('should return undefined when the active page index is absent or negative', () => {
    expect(getOneBasedPageForFilingFeeReturn(undefined)).toBeUndefined();
    expect(getOneBasedPageForFilingFeeReturn(-1)).toBeUndefined();
  });

  it('should return undefined for the first page', () => {
    expect(getOneBasedPageForFilingFeeReturn(0)).toBeUndefined();
  });

  it('should return a one-based page for later indexes', () => {
    expect(getOneBasedPageForFilingFeeReturn(1)).toBe(2);
    expect(getOneBasedPageForFilingFeeReturn(2)).toBe(3);
  });
});

describe('useClientSidePaginator', () => {
  const useStateMock = React.useState as jest.Mock;
  const useEffectMock = React.useEffect as jest.Mock;

  beforeEach(() => {
    useStateMock.mockReset();
    useEffectMock.mockReset();
    useEffectMock.mockImplementation((effect: () => void) => {
      effect();
    });
  });

  it('should initialize activePage from initialActivePage', () => {
    const setActivePage = jest.fn();
    useStateMock.mockReturnValue([2, setActivePage]);

    const result = useClientSidePaginator([1, 2, 3, 4, 5, 6], 2, {
      initialActivePage: 2,
    });

    expect(result.activePage).toBe(2);
    expect(result.pageRecords).toEqual([5, 6]);
  });

  it('should update activePage when initialActivePage changes', () => {
    const setActivePage = jest.fn();
    useStateMock.mockReturnValue([1, setActivePage]);

    useClientSidePaginator([1, 2, 3, 4, 5, 6], 2, {
      initialActivePage: 2,
    });

    expect(setActivePage).toHaveBeenCalledWith(2);
  });

  it('should not sync activePage when initialActivePage is undefined', () => {
    const setActivePage = jest.fn();
    useStateMock.mockReturnValue([0, setActivePage]);

    useClientSidePaginator([1, 2, 3, 4], 2);

    expect(setActivePage).not.toHaveBeenCalled();
  });
});
