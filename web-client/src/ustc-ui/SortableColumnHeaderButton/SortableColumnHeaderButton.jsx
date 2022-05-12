import { Button } from '../../ustc-ui/Button/Button';
import { DESCENDING } from '../../presenter/presenterConstants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const SortableColumnHeaderButton = connect(
  {
    getSortIndicatorConfiguration: state.sortableColumnHelper,
    tableSort: state.tableSort,
  },
  ({
    ascText = 'in ascending order',
    defaultSort,
    descText = 'in descending order',
    getSortIndicatorConfiguration,
    hasRows,
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
            sortActive: tableSort.sortField === sortField && hasRows,
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
        )}
      </Button>
    );
  },
);

const getFontAwesomeIcon = ({ direction, title }) => {
  const fontAwesomeIcon = direction === DESCENDING ? 'caret-down' : 'caret-up';
  return <FontAwesomeIcon icon={fontAwesomeIcon} title={title} />;
};
