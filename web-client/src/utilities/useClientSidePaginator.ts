import { useState } from 'react';

export type PaginationResult<T> = {
  activePage: number;
  pageRecords: T[];
  setActivePage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
};

export function getPaginationResult<T>(
  fullDataSet: T[],
  pageSize: number,
  activePage: number,
) {
  const totalPages = Math.ceil(fullDataSet.length / pageSize);
  const pageRecords = sliceForPage(fullDataSet, pageSize, activePage);

  return { pageRecords, totalPages };
}

function sliceForPage<T>(fullDataSet: T[], pageSize: number, activePage: number) {
  return fullDataSet.slice(
    activePage * pageSize,
    activePage * pageSize + pageSize,
  );
}

export function useClientSidePaginator<T>(
  fullDataSet: T[],
  pageSize: number,
): PaginationResult<T> {
  const [activePage, setActivePage] = useState(0);

  const totalPages = Math.ceil(fullDataSet.length / pageSize);
  // Clamp the active page so it stays within the valid range when the
  // data set shrinks (e.g., from filtering). This preserves the user's
  // position across data changes that don't affect length (sorting,
  // selecting checkboxes) instead of resetting them back to page 0.
  const clampedActivePage = Math.min(activePage, Math.max(0, totalPages - 1));

  const pageRecords = sliceForPage(fullDataSet, pageSize, clampedActivePage);

  return {
    activePage: clampedActivePage,
    pageRecords,
    setActivePage,
    totalPages,
  };
}
