import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { getConstants } from '../../getConstants';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

const { DESCENDING } = getConstants();

export const SortableColumnHeaderButton = connect(
  {
    getSortIndicatorConfiguration:
      state.sortableColumnHelper.getSortIndicatorConfiguration,
    isActive: state.sortableColumnHelper.isActive,
    tableSort: state.tableSort,
  },
  ({
    ascText = 'in ascending order',
    defaultSort,
    descText = 'in descending order',
    getSortIndicatorConfiguration,
    hasRows,
    isActive,
    onClickSequence,
    sortField,
    tableSort,
    title,
  }) => {
    const [isLoading, setIsLoading] = React.useState(false);

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
                defaultSort,
                sortField,
              }).then(() => setIsLoading(false));
            });
          }
        }}
      >
        <span
          className={classNames('margin-right-105', {
            sortActive: isActive({ hasRows, sortField, tableSort }),
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
          getFontAwesomeIcon(
            getSortIndicatorConfiguration({
              ascText,
              defaultSort,
              descText,
              sortField,
              tableSort,
            }),
            isActive({ hasRows, sortField, tableSort }),
          )}
      </Button>
    );
  },
);

SortableColumnHeaderButton.displayName = 'SortableColumnHeaderButton';

const getFontAwesomeIcon = ({ direction, title }, isActiveColumn) => {
  let fontAwesomeIcon =
    direction === DESCENDING ? 'long-arrow-alt-down' : 'long-arrow-alt-up';

  if (!isActiveColumn) {
    fontAwesomeIcon = 'exchange-alt';
    title = '';
  }

  return (
    <FontAwesomeIcon
      className={
        isActiveColumn ? 'icon-sortable-header-active' : 'icon-sortable-header'
      }
      icon={fontAwesomeIcon}
      title={title}
    />
  );
};
