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
  ...props
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
      data-testid={props['data-testid']}
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
        className={classNames('margin-right-1', {
          sortActive: isActive,
        })}
      >
        {title}
      </span>
      <span className="text-no-wrap">
        {/* We use a non-breaking space to force the icon to wrap with the text, not independently */}
        &nbsp;
        {/* We fix the icon width so that switching from double arrow to smaller single arrow icon does not affect line-breaking behavior */}
        <span className="display-inline-block width-205">
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
        </span>
      </span>
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
