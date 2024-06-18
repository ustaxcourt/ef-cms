import { DocketEntry } from '../../../../../shared/src/business/entities/DocketEntry';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { needsNewCoversheet } from './completeDocketEntryQCInteractor';

describe('completeDocketEntryQCInteractor needsNewCoversheet', () => {
  let currentDocketEntry;
  let updatedDocketEntry;
  beforeEach(() => {
    currentDocketEntry = new DocketEntry(
      {
        certificateOfService: false,
        documentTitle: 'fake title',
        filedBy: 'petitioner.high',
        receivedAt: '2019-08-25T05:00:00.000Z',
      },
      { applicationContext },
    );

    updatedDocketEntry = new DocketEntry(
      {
        certificateOfService: false,
        documentTitle: 'fake title',
        filedBy: 'petitioner.high',
        receivedAt: '2019-08-25T05:00:00.000Z',
      },
      { applicationContext },
    );
  });
  it('should return true when receivedAt is updated', () => {
    updatedDocketEntry.receivedAt = '2020-08-26T05:00:00.000Z';
    const result = needsNewCoversheet({
      applicationContext,
      currentDocketEntry,
      updatedDocketEntry,
    });
    expect(result).toEqual(true);
  });

  it('should return false when receivedAt format is different but the date is the same', () => {
    currentDocketEntry.receivedAt = '2019-08-25';
    updatedDocketEntry.receivedAt = '2019-08-25T05:00:00.000Z';
    const result = needsNewCoversheet({
      applicationContext,
      currentDocketEntry,
      updatedDocketEntry,
    });

    expect(result).toEqual(false);
  });

  it('should return true when certificateOfService is updated', () => {
    updatedDocketEntry.certificateOfService = true;
    const result = needsNewCoversheet({
      applicationContext,
      currentDocketEntry,
      updatedDocketEntry,
    });
    expect(result).toEqual(true);
  });

  it('should return false when filedBy is updated', () => {
    updatedDocketEntry.filedBy = 'petitioner.smith';
    const result = needsNewCoversheet({
      applicationContext,
      currentDocketEntry,
      updatedDocketEntry,
    });
    expect(result).toEqual(false);
  });

  it('should return true when documentTitle is updated', () => {
    updatedDocketEntry.documentTitle = 'fake title 2';
    const result = needsNewCoversheet({
      applicationContext,
      currentDocketEntry,
      updatedDocketEntry,
    });
    expect(result).toEqual(true);
  });
});
