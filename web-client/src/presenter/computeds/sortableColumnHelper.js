import { ASCENDING, DESCENDING } from '../presenterConstants';

/**
 * Provides two functions for use with SortableColumnHeaderButton.
 * getSortIndicatorConfiguration provides information for choosing the FontAwesome icon.
 * isActive informs whether the column is the active column.
 *
 * @returns { object } the getSortIndicatorConfiguration and isActive functions
 */
export const sortableColumnHelper = () => {
  return {
    getSortIndicatorConfiguration: ({
      ascText,
      defaultSort,
      descText,
      sortField,
      tableSort,
    }) => {
      let direction = '';
      let title = '';
      if (tableSort.sortField !== sortField && defaultSort === DESCENDING) {
        direction = DESCENDING;
        title = descText;
      } else if (
        tableSort.sortField !== sortField &&
        defaultSort === ASCENDING
      ) {
        direction = ASCENDING;
        title = ascText;
      } else if (
        tableSort.sortField === sortField &&
        tableSort.sortOrder === DESCENDING
      ) {
        direction = DESCENDING;
        title = descText;
      } else if (
        tableSort.sortField === sortField &&
        tableSort.sortOrder === ASCENDING
      ) {
        direction = ASCENDING;
        title = ascText;
      }

      return {
        direction,
        title,
      };
    },
    isActive: ({ hasRows, sortField, tableSort }) =>
      tableSort.sortField === sortField && hasRows,
  };
};
