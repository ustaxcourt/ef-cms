import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import classNames from 'classnames';

export const SortableColumnHeaderButton = ({
  defaultSort,
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
        ascText: 'moof',
        defaultSort,
        descText: 'dogcow',
        sortField,
        tableSort,
      })}
      {tableSort.sortField !== sortField && defaultSort === 'desc' && (
        <FontAwesomeIcon icon="caret-down" title="in descending order" />
      )}
      {tableSort.sortField !== sortField && defaultSort === 'asc' && (
        <FontAwesomeIcon icon="caret-up" title="in ascending order" />
      )}
      {tableSort.sortField === sortField && tableSort.sortOrder === 'asc' && (
        <FontAwesomeIcon icon="caret-up" title="in ascending order" />
      )}
      {tableSort.sortField === sortField && tableSort.sortOrder === 'desc' && (
        <FontAwesomeIcon icon="caret-down" title="in descending order" />
      )}
    </Button>
  );
};

const getIcon = ({ ascText, defaultSort, descText, sortField, tableSort }) => {
  // TODO: Continue work, capture logic correctly

  let icon = '';
  let title = '';
  if (tableSort.sortField !== sortField && defaultSort === 'desc') {
    icon = 'alksdfjklasdflksdajf';
    title = 'something else';
  }

  return <FontAwesomeIcon icon={icon} title={title} />;
};
