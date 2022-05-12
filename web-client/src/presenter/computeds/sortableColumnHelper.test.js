import { ASCENDING, DESCENDING } from '../presenterConstants';
import { runCompute } from 'cerebral/test';
import { sortableColumnHelper } from './sortableColumnHelper';

describe('sortableColumnHelper', () => {
  it('direction is set to descending when the last sortField is different from the provided sortField argument and defaultSort is DESCENDING', () => {
    const getIconFn = runCompute(sortableColumnHelper);
    const DESC_TEXT = 'down';
    expect(
      getIconFn({
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
    const getIconFn = runCompute(sortableColumnHelper);
    const ASC_TEXT = 'up';
    expect(
      getIconFn({
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
    const getIconFn = runCompute(sortableColumnHelper);
    const DESC_TEXT = 'down';
    expect(
      getIconFn({
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
    const getIconFn = runCompute(sortableColumnHelper);
    const ASC_TEXT = 'up';
    expect(
      getIconFn({
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
    const getIconFn = runCompute(sortableColumnHelper);
    const ASC_TEXT = 'up';
    expect(
      getIconFn({
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
