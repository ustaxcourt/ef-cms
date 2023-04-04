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
          caseCaption: 'ABCDEFGHI',
          docketEntryId: 1,
          filingDate: '2023-03-11T05:00:00.000Z',
        },
        {
          ...mockTCRP,
          caseCaption: 'FGHI',
          docketEntryId: 2,
          filingDate: '2022-02-05T05:00:00.000Z',
        },
        {
          ...mockTCRP,
          caseCaption: 'BCDEFGHI',
          docketEntryId: 3,
          filingDate: '2023-07-05T05:00:00.000Z',
        },
        {
          ...mockTCRP,
          caseCaption: 'EFGHI',
          docketEntryId: 4,
          filingDate: '2022-02-05T05:00:00.000Z',
        },
      ],
    };
  });

  it('should organize opinion pamphlets by filing date, and then by caseCaption for each filing date', () => {
    const { pamphletsGroupedByFilingDate } = runCompute(
      opinionPamphletsHelper,
      { state },
    );

    expect(pamphletsGroupedByFilingDate).toEqual({
      '2022-02-05': [
        {
          ...mockTCRP,
          caseCaption: 'EFGHI',
          docketEntryId: 4,
          filingDateWithFullYear: '2022-02-05',
          formattedFilingDate: '02/05/22',
        },
        {
          caseCaption: 'FGHI',
          ...mockTCRP,
          docketEntryId: 2,
          filingDateWithFullYear: '2022-02-05',
          formattedFilingDate: '02/05/22',
        },
      ],
      '2023-03-11': [
        {
          ...mockTCRP,
          caseCaption: 'ABCDEFGHI',
          docketEntryId: 1,
          filingDateWithFullYear: '2023-03-11',
          formattedFilingDate: '03/11/23',
        },
      ],
      '2023-07-05': [
        {
          ...mockTCRP,
          caseCaption: 'BCDEFGHI',
          docketEntryId: 3,
          filingDateWithFullYear: '2023-07-05',
          formattedFilingDate: '07/05/23',
        },
      ],
    });
  });

  it('should create a map of unique filing period years with their associated filing dates', () => {
    const { yearAndFilingDateMap } = runCompute(opinionPamphletsHelper, {
      state,
    });

    expect(yearAndFilingDateMap).toEqual({
      '2022': ['2022-02-05'],
      '2023': ['2023-03-11', '2023-07-05'],
    });
  });

  it('should return a list of unique years that pamphlets were filed in in descedning order', () => {
    const { pamphletPeriods } = runCompute(opinionPamphletsHelper, {
      state,
    });

    expect(pamphletPeriods).toEqual(['2023', '2022']);
  });

  describe('getPamhpletToDisplay', () => {
    it('should return the first TCRP pamphlet with the filing date key specified', () => {
      const { getPamhpletToDisplay } = runCompute(opinionPamphletsHelper, {
        state,
      });

      expect(getPamhpletToDisplay('2022-02-05')).toEqual({
        ...mockTCRP,
        caseCaption: 'EFGHI',
        docketEntryId: 4,
        filingDateWithFullYear: '2022-02-05',
        formattedFilingDate: '02/05/22',
      });
    });
  });
});
