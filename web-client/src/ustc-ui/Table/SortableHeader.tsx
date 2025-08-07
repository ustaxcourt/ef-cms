import {
  ASCENDING,
  SORT_ASCENDING_TEXT,
  SORT_DESCENDING_TEXT,
} from '@shared/business/entities/EntityConstants';
import { SortableColumn } from '@web-client/ustc-ui/Table/SortableColumn';
import React from 'react';

export function SortableHeader({
  className,
  hideOnMobile,
  onSort,
  screenReaderTitle,
  sortField,
  sortType,
  tableSort,
  title,
  stateKey,
}: {
  className?: string;
  onSort: (sort: {
    sortField: string;
    sortOrder: 'asc' | 'desc';
    stateKey?: string;
  }) => void;
  screenReaderTitle?: string;
  sortField: string;
  sortType?: 'string' | 'date';
  tableSort: {
    sortField: string;
    sortOrder: 'asc' | 'desc';
  };
  title: string;
  hideOnMobile?: boolean;
  stateKey: string;
}) {
  return (
    <th className={hideOnMobile ? 'hide-on-mobile' : ''}>
      <SortableColumn
        ascText={SORT_ASCENDING_TEXT[sortType!]}
        className={className}
        currentlySortedField={tableSort.sortField}
        currentlySortedOrder={tableSort.sortOrder}
        data-testid={`${sortField}-sortable-button`}
        defaultSortOrder={ASCENDING}
        descText={SORT_DESCENDING_TEXT[sortType!]}
        hasRows={true}
        screenReaderTitle={screenReaderTitle}
        sortField={sortField}
        title={title}
        onClickSequence={sortTableInfo =>
          onSort({
            ...sortTableInfo,
            stateKey,
          })
        }
      />
    </th>
  );
}
