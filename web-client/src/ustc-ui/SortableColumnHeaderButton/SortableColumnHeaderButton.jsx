import { Button } from '../../ustc-ui/Button/Button';
import { DESCENDING } from '../../presenter/presenterConstants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

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
    return (
      <Button
        link
        className={'sortable-header-button margin-right-0'}
        onClick={() => {
          if (hasRows) {
            onClickSequence({
              defaultSort,
              sortField,
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
        {getFontAwesomeIcon(
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

const getFontAwesomeIcon = ({ direction, title }, isActiveColumn) => {
  let fontAwesomeIcon =
    direction === DESCENDING ? 'long-arrow-alt-down' : 'long-arrow-alt-up';

  let rotation;

  if (!isActiveColumn) {
    fontAwesomeIcon = 'exchange-alt';
    rotation = 90;
  }

  return (
    <FontAwesomeIcon
      className={isActiveColumn ? 'icon-sortable-header' : ''}
      icon={fontAwesomeIcon}
      rotation={rotation}
      title={title}
    />
  );
};
