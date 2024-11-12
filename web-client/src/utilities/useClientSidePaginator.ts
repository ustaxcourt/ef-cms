import { useState } from 'react';

type PaginationResult<T> = {
  activePage: number;
  pageRecords: T[];
  setActivePage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
};

export function useClientSidePaginator<T>(
  fullDataSet: T[],
  pageSize,
): PaginationResult<T> {
  const [activePage, setActivePage] = useState(0);
  const totalPages = Math.ceil(fullDataSet.length / pageSize);
  const entriesInPage = fullDataSet.slice(
    activePage * pageSize,
    activePage * pageSize + pageSize,
  );

  return {
    activePage,
    pageRecords: entriesInPage,
    setActivePage,
    totalPages,
  };
}
