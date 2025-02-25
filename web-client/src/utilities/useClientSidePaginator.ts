import { useState, useEffect } from 'react';

type PaginationResult<T> = {
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
  const pageRecords = fullDataSet.slice(
    activePage * pageSize,
    activePage * pageSize + pageSize,
  );

  return { pageRecords, totalPages };
}

export function useClientSidePaginator<T>(
  fullDataSet: T[],
  pageSize: number,
): PaginationResult<T> {
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    setActivePage(0); // If your data set changes go back to page 0;
  }, [fullDataSet]);

  const { pageRecords, totalPages } = getPaginationResult(
    fullDataSet,
    pageSize,
    activePage,
  );

  return { activePage, pageRecords, setActivePage, totalPages };
}
