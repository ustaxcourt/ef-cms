import { getNeedsNewCoversheet } from './completeDocketEntryQCInteractor';

describe('completeDocketEntryQCInteractor getNeedsNewCoversheet', () => {
  it('should return true when receivedAt is updated', () => {
    const needsNewCoversheet = getNeedsNewCoversheet({
      currentDocketEntry: {
        receivedAt: '2019-08-25T05:00:00.000Z',
      },
      updatedDocketEntry: {
        receivedAt: '2020-08-26T05:00:00.000Z',
      },
    });

    expect(needsNewCoversheet).toBeTruthy();
  });

  it('should return false when receivedAt format is different but the date is the same', () => {
    const needsNewCoversheet = getNeedsNewCoversheet({
      currentDocketEntry: {
        receivedAt: '2019-08-25',
      },
      updatedDocketEntry: {
        receivedAt: '2019-08-25T05:00:00.000Z',
      },
    });

    expect(needsNewCoversheet).toBeFalsy();
  });

  it('should return true when certificateOfService is updated', () => {
    const needsNewCoversheet = getNeedsNewCoversheet({
      currentDocketEntry: {
        certificateOfService: false,
        receivedAt: '2019-08-12T05:00:00.000Z',
      },
      updatedDocketEntry: {
        certificateOfService: true,
        receivedAt: '2019-08-12T05:00:00.000Z',
      },
    });

    expect(needsNewCoversheet).toBeTruthy();
  });

  it('should return false when filedBy is updated', () => {
    const needsNewCoversheet = getNeedsNewCoversheet({
      currentDocketEntry: {
        filedBy: 'petitioner.smith',
        receivedAt: '2019-08-12T05:00:00.000Z',
      },
      updatedDocketEntry: {
        filedBy: 'petitioner.high',
        receivedAt: '2019-08-12T05:00:00.000Z',
      },
    });

    expect(needsNewCoversheet).toBeFalsy();
  });

  it('should return true when documentTitle is updated', () => {
    const needsNewCoversheet = getNeedsNewCoversheet({
      currentDocketEntry: {
        documentTitle: 'fake title',
        receivedAt: '2019-08-12T05:00:00.000Z',
      },
      updatedDocketEntry: {
        documentTitle: 'fake title 2!!!',
        receivedAt: '2019-08-12T05:00:00.000Z',
      },
    });

    expect(needsNewCoversheet).toBeTruthy();
  });
});
