import {
  CaseWithSelectionInfo,
  getSelectedConsolidatedCasesToMultiDocketOn,
} from './getSelectedConsolidatedCasesToMultiDocketOn';

describe('getSelectedConsolidatedCasesToMultiDocketOn', () => {
  let consolidatedCases: CaseWithSelectionInfo[];
  beforeEach(() => {
    consolidatedCases = [];
  });

  it('returns an empty array if there if the list of consolidated cases is undefined', () => {
    const result = getSelectedConsolidatedCasesToMultiDocketOn(undefined);

    expect(result).toEqual([]);
  });

  it('returns a list of docket numbers with suffixes for cases that were previously selected', () => {
    consolidatedCases = [
      {
        checked: true,
        docketNumberWithSuffix: '101-20L',
      },
      {
        checked: false,
        docketNumberWithSuffix: '103-20S',
      },
    ];

    const result =
      getSelectedConsolidatedCasesToMultiDocketOn(consolidatedCases);

    expect(result).toEqual(['101-20L']);
  });
});
