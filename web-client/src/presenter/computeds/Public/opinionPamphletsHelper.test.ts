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

  it('should create a map of unique filing period years with their associated filing dates', () => {
    const { yearAndFilingDateMap } = runCompute(opinionPamphletsHelper, {
      state,
    });

    expect(yearAndFilingDateMap).toEqual({
      '2022': ['2022-02-05'],
      '2023': ['2023-03-11', '2023-07-05'],
    });
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
});
