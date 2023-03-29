import { applicationContextPublic } from '../../../applicationContextPublic';
import { opinionPamphletsHelper as opinionPamphletsHelperComputed } from './opinionPamphletsHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../withAppContext';

describe('opinionPamphletsHelper', () => {
  const opinionPamphletsHelper = withAppContextDecorator(
    opinionPamphletsHelperComputed,
    applicationContextPublic,
  );

  const mockTCRP = {
    caseCaption: 'Hanan Al Hroub, Petitioner',
    docketNumber: '104-20',
    documentTitle: 'Pamhplet 1',
    documentType: 'Tax Court Report Pamphlet',
    eventCode: 'TCRP',
  };

  let state;

  beforeEach(() => {
    state = {
      opinionPamphlets: [
        {
          ...mockTCRP,
          docketEntryId: 1,
          filingDate: '2023-03-11T05:00:00.000Z',
        },
        {
          ...mockTCRP,
          docketEntryId: 2,
          filingDate: '2022-02-05T05:00:00.000Z',
        },
        {
          ...mockTCRP,
          docketEntryId: 3,
          filingDate: '2023-07-05T05:00:00.000Z',
        },
        {
          ...mockTCRP,
          docketEntryId: 4,
          filingDate: '2022-02-05T05:00:00.000Z',
        },
      ],
    };
  });

  it('should extract unique filing years from the list of opinion pamhplets in state', () => {
    const { pamphletPeriods } = runCompute(opinionPamphletsHelper, { state });

    expect(pamphletPeriods).toEqual(['2023', '2022']);
  });

  it('should organize opinion pamphlets by filing date', () => {
    const { pamphletsByDate } = runCompute(opinionPamphletsHelper, { state });

    expect(pamphletsByDate).toEqual({
      '2022-02-05': [
        {
          ...mockTCRP,
          docketEntryId: 2,
          filingDate: '02/05/22',
          formattedFilingDate: '2022-02-05',
        },
        {
          ...mockTCRP,
          docketEntryId: 4,
          filingDate: '02/05/22',
          formattedFilingDate: '2022-02-05',
        },
      ],
      '2023-03-11': [
        {
          ...mockTCRP,
          docketEntryId: 1,
          filingDate: '03/11/23',
          formattedFilingDate: '2023-03-11',
        },
      ],
      '2023-07-05': [
        {
          ...mockTCRP,
          docketEntryId: 3,
          filingDate: '07/05/23',
          formattedFilingDate: '2023-07-05',
        },
      ],
    });
  });

  it('should return a list of all unique filing dates', () => {
    const { filingDateKeys } = runCompute(opinionPamphletsHelper, { state });

    expect(filingDateKeys).toEqual(['2023-03-11', '2022-02-05', '2023-07-05']);
  });

  describe('getPamhpletToDisplay', () => {
    it('should return the first TCRP pamphlet with the filing date key specified', () => {
      const { getPamhpletToDisplay } = runCompute(opinionPamphletsHelper, {
        state,
      });

      expect(getPamhpletToDisplay('2022-02-05')).toEqual({
        ...mockTCRP,
        docketEntryId: 2,
        filingDate: '02/05/22',
        formattedFilingDate: '2022-02-05',
      });
    });
  });

  describe('shouldShowPamphletsForYear', () => {
    it('should be true when the filing date is from the year that was passed in', () => {
      const { shouldShowPamphletsForYear } = runCompute(
        opinionPamphletsHelper,
        {
          state,
        },
      );

      expect(
        shouldShowPamphletsForYear({
          filingDateKey: '2022-02-05',
          year: '2022',
        }),
      ).toBe(true);
    });

    it('should be false when the filing date is NOT from the year that was passed in', () => {
      const { shouldShowPamphletsForYear } = runCompute(
        opinionPamphletsHelper,
        {
          state,
        },
      );

      expect(
        shouldShowPamphletsForYear({
          filingDateKey: '2022-02-05',
          year: '2030',
        }),
      ).toBe(false);
    });
  });
});
