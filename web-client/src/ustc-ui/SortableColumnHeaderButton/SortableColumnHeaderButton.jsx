import { ASCENDING, DESCENDING } from '../../presenter/presenterConstants';
import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import classNames from 'classnames';

export const SortableColumnHeaderButton = ({
  ascText = 'in ascending order',
  defaultSort,
  descText = 'in descending order',
  onClickSequence,
  sortField,
  tableSort,
  title,
}) => {
  return (
    <Button
      link
      className={'sortable-header-button margin-right-0'}
      onClick={() =>
        onClickSequence({
          defaultSort,
          sortField,
        })
      }
    >
      <span
        className={classNames('margin-right-105', {
          sortActive: tableSort.sortField === sortField,
        })}
      >
        {title}
      </span>
      {getIcon({
        ascText,
        defaultSort,
        descText,
        sortField,
        tableSort,
      })}
      {/*{tableSort.sortField !== sortField && defaultSort === 'desc' && (*/}
      {/*  <FontAwesomeIcon icon="caret-down" title="in descending order" />*/}
      {/*)}*/}
      {/*{tableSort.sortField !== sortField && defaultSort === 'asc' && (*/}
      {/*  <FontAwesomeIcon icon="caret-up" title="in ascending order" />*/}
      {/*)}*/}
      {/*{tableSort.sortField === sortField && tableSort.sortOrder === 'asc' && (*/}
      {/*  <FontAwesomeIcon icon="caret-up" title="in ascending order" />*/}
      {/*)}*/}
      {/*{tableSort.sortField === sortField && tableSort.sortOrder === 'desc' && (*/}
      {/*  <FontAwesomeIcon icon="caret-down" title="in descending order" />*/}
      {/*)}*/}
    </Button>
  );
};

const getIcon = ({ ascText, defaultSort, descText, sortField, tableSort }) => {
  let icon = '';
  let title = '';
  if (tableSort.sortField !== sortField && defaultSort === DESCENDING) {
    icon = 'caret-down';
    title = descText;
  } else if (tableSort.sortField !== sortField && defaultSort === ASCENDING) {
    icon = 'caret-up';
    title = ascText;
  } else if (
    tableSort.sortField === sortField &&
    tableSort.sortOrder === DESCENDING
  ) {
    icon = 'caret-down';
    title = descText;
  } else if (
    tableSort.sortField === sortField &&
    tableSort.sortOrder === ASCENDING
  ) {
    icon = 'caret-up';
    title = ascText;
  }

  return <FontAwesomeIcon icon={icon} title={title} />;
};
