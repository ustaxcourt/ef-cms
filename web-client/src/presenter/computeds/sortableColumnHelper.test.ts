import { getConstants } from '../../getConstants';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { sortableColumnHelper } from './sortableColumnHelper';

const { ASCENDING, DESCENDING } = getConstants();

describe('sortableColumnHelper', () => {
  describe('getSortIndicatorConfiguration', () => {
    it('direction is set to descending when the last sortField is different from the provided sortField argument and defaultSort is DESCENDING', () => {
      const { getSortIndicatorConfiguration } =
        runCompute(sortableColumnHelper);
      const DESC_TEXT = 'down';
      expect(
        getSortIndicatorConfiguration({
          defaultSort: DESCENDING,
          descText: DESC_TEXT,
          sortField: 'createdAt',
          tableSort: {
            sortField: 'docketNumber',
          },
        }),
      ).toMatchObject({
        direction: DESCENDING,
        title: DESC_TEXT,
      });
    });

    it('direction is set to ASCENDING when the last sortField is different from the provided sortField argument and defaultSort is ASCENDING', () => {
      const { getSortIndicatorConfiguration } =
        runCompute(sortableColumnHelper);
      const ASC_TEXT = 'up';
      expect(
        getSortIndicatorConfiguration({
          ascText: ASC_TEXT,
          defaultSort: ASCENDING,
          sortField: 'createdAt',
          tableSort: {
            sortField: 'docketNumber',
          },
        }),
      ).toMatchObject({
        direction: ASCENDING,
        title: ASC_TEXT,
      });
    });

    it('direction is set to DESCENDING when the last sortField is the same as the provided sortField argument and sortOrder is DESCENDING', () => {
      const { getSortIndicatorConfiguration } =
        runCompute(sortableColumnHelper);
      const DESC_TEXT = 'down';
      expect(
        getSortIndicatorConfiguration({
          defaultSort: DESCENDING,
          descText: DESC_TEXT,
          sortField: 'createdAt',
          tableSort: {
            sortField: 'createdAt',
            sortOrder: DESCENDING,
          },
        }),
      ).toMatchObject({
        direction: DESCENDING,
        title: DESC_TEXT,
      });
    });

    it('direction is set to ASCENDING when the last sortField is the same as the provided sortField argument and sortOrder is ASCENDING', () => {
      const { getSortIndicatorConfiguration } =
        runCompute(sortableColumnHelper);
      const ASC_TEXT = 'up';
      expect(
        getSortIndicatorConfiguration({
          ascText: ASC_TEXT,
          defaultSort: ASCENDING,
          sortField: 'createdAt',
          tableSort: {
            sortField: 'createdAt',
            sortOrder: ASCENDING,
          },
        }),
      ).toMatchObject({
        direction: ASCENDING,
        title: ASC_TEXT,
      });
    });

    it('sets direction and title to empty strings if no branch logic is executed', () => {
      const { getSortIndicatorConfiguration } =
        runCompute(sortableColumnHelper);
      const ASC_TEXT = 'up';
      expect(
        getSortIndicatorConfiguration({
          ascText: ASC_TEXT,
          defaultSort: ASCENDING,
          sortField: 'createdAt',
          tableSort: {
            sortField: 'createdAt',
            sortOrder: 'UNKNOWN',
          },
        }),
      ).toMatchObject({
        direction: '',
        title: '',
      });
    });
  });

  describe('isActive', () => {
    it('returns false when hasRows is false', () => {
      const { isActive } = runCompute(sortableColumnHelper);
      expect(
        isActive({
          hasRows: false,
          sortField: 'createdAt',
          tableSort: {
            sortField: 'createdAt',
          },
        }),
      ).toBeFalsy();
    });

    it('returns false when sortField does not match tableSort.sortField', () => {
      const { isActive } = runCompute(sortableColumnHelper);
      expect(
        isActive({
          hasRows: true,
          sortField: 'docketNumber',
          tableSort: {
            sortField: 'createdAt',
          },
        }),
      ).toBeFalsy();
    });

    it('returns true when sortFields match and hasRows is true', () => {
      const { isActive } = runCompute(sortableColumnHelper);
      expect(
        isActive({
          hasRows: true,
          sortField: 'createdAt',
          tableSort: {
            sortField: 'createdAt',
          },
        }),
      ).toBeTruthy();
    });
  });
});
