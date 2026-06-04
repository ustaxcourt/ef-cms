import { DocketEntry } from './DocketEntry';
import { A_VALID_DOCKET_ENTRY } from '@shared/business/entities/DocketEntryTestFixtures';

describe('isMultiDocketed', () => {
  it('should return true when multiDocketedOn has more than one docket number', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        multiDocketedOn: ['101-21', '102-21'],
      },
      { authorizedUser: undefined },
    );

    expect(DocketEntry.isMultiDocketed(docketEntry)).toBe(true);
  });

  it('should return false when multiDocketedOn has only one docket number', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        multiDocketedOn: ['101-21'],
      },
      { authorizedUser: undefined },
    );

    expect(DocketEntry.isMultiDocketed(docketEntry)).toBe(false);
  });

  it('should return false when multiDocketedOn is an empty array', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        multiDocketedOn: [],
      },
      { authorizedUser: undefined },
    );

    expect(DocketEntry.isMultiDocketed(docketEntry)).toBe(false);
  });

  it('should return false when multiDocketedOn is not provided', () => {
    const docketEntry = new DocketEntry(
      { ...A_VALID_DOCKET_ENTRY },
      { authorizedUser: undefined },
    );

    expect(DocketEntry.isMultiDocketed(docketEntry)).toBe(false);
  });
});
