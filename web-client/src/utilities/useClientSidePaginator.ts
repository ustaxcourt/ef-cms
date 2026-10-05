import { useEffect, useState } from 'react';

export type PaginationResult<T> = {
  activePage: number;
  pageRecords: T[];
  setActivePage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
};

export type UseClientSidePaginatorOptions = {
  initialActivePage?: number;
};

export function getActivePageIndexFromOneBasedPageQuery(
  page?: string | null,
): number {
  if (page === undefined || page === null || page === '') {
    return 0;
  }

  const parsed = Number.parseInt(String(page), 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 0;
  }

  return parsed - 1;
}

export function getOneBasedPageForFilingFeeReturn(
  activePageIndex?: number,
): number | undefined {
  if (activePageIndex === undefined || activePageIndex < 0) {
    return undefined;
  }

  const oneBasedPage = activePageIndex + 1;
  if (oneBasedPage <= 1) {
    return undefined;
  }

  return oneBasedPage;
}

export function getPaginationResult<T>(
  fullDataSet: T[],
  pageSize: number,
  activePage: number,
) {
  const totalPages = Math.ceil(fullDataSet.length / pageSize);
  const pageRecords = sliceForPage(fullDataSet, pageSize, activePage);

  return { pageRecords, totalPages };
}

function sliceForPage<T>(
  fullDataSet: T[],
  pageSize: number,
  activePage: number,
) {
  return fullDataSet.slice(
    activePage * pageSize,
    activePage * pageSize + pageSize,
  );
}

export function useClientSidePaginator<T>(
  fullDataSet: T[],
  pageSize: number,
  options?: UseClientSidePaginatorOptions,
): PaginationResult<T> {
  const [activePage, setActivePage] = useState(options?.initialActivePage ?? 0);

  useEffect(() => {
    if (options?.initialActivePage === undefined) {
      return;
    }

    setActivePage(options.initialActivePage);
  }, [options?.initialActivePage]);

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
