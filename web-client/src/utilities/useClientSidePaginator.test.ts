import { getPaginationResult } from './useClientSidePaginator';

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
