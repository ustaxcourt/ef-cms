import { Button } from '../Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getConstants } from '../../getConstants';
import React from 'react';
import classNames from 'classnames';

const { ASCENDING, DESCENDING } = getConstants();

export const SortableColumn = ({
  ascText = 'in ascending order',
  currentlySortedField,
  currentlySortedOrder,
  defaultSortOrder = 'desc',
  descText = 'in descending order',
  hasRows,
  onClickSequence,
  sortField,
  title,
}: {
  ascText: string;
  defaultSortOrder?: 'asc' | 'desc';
  currentlySortedField: string;
  descText: string;
  hasRows: boolean;
  onClickSequence: (sort: {
    sortField: string;
    sortOrder: 'asc' | 'desc';
  }) => void;
  sortField: string;
  title: string;
  currentlySortedOrder: 'asc' | 'desc';
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const isActive = currentlySortedField === sortField;

  let sortOrder: 'asc' | 'desc';
  if (isActive) {
    sortOrder = currentlySortedOrder === 'asc' ? 'desc' : 'asc';
  } else {
    sortOrder = defaultSortOrder;
  }

  return (
    <Button
      link
      className={'sortable-header-button margin-right-0'}
      onClick={() => {
        if (hasRows) {
          setIsLoading(true);
          // we invoke the click sequence AFTER the next animation frame to give
          // the browser time to display the spinner in the header before it tries to fetch
          // and re-render the 3000 messages in the message table.
          requestAnimationFrame(() => {
            onClickSequence({
              sortField,
              sortOrder,
            }).then(() => setIsLoading(false));
          });
        }
      }}
    >
      <span
        className={classNames('margin-right-105', {
          sortActive: isActive,
        })}
      >
        {title}
      </span>
      {isLoading && (
        <FontAwesomeIcon
          className="fa-spin spinner"
          icon="sync"
          size="sm"
          title="sorting results"
        />
      )}
      {!isLoading &&
        getFontAwesomeIcon({
          ascText,
          descText,
          direction: currentlySortedOrder,
          isActiveColumn: isActive,
        })}
    </Button>
  );
};

SortableColumn.displayName = 'SortableColumn';

const getFontAwesomeIcon = ({
  ascText,
  descText,
  direction,
  isActiveColumn,
}: {
  direction: string;
  ascText: string;
  descText: string;
  isActiveColumn: boolean;
}) => {
  let fontAwesomeIcon =
    direction === DESCENDING ? 'long-arrow-alt-down' : 'long-arrow-alt-up';
  let tooltipText = direction === ASCENDING ? ascText : descText;

  if (!isActiveColumn) {
    fontAwesomeIcon = 'exchange-alt';
    tooltipText = '';
  }

  return (
    <FontAwesomeIcon
      className={
        isActiveColumn ? 'icon-sortable-header-active' : 'icon-sortable-header'
      }
      icon={fontAwesomeIcon}
      title={tooltipText}
    />
  );
};
