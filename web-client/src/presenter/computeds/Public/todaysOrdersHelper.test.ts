import { applicationContextPublic } from '../../../applicationContextPublic';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { todaysOrdersHelper as todaysOrdersHelperComputed } from './todaysOrdersHelper';
import { withAppContextDecorator } from '../../../withAppContext';

const todaysOrdersHelper = withAppContextDecorator(
  todaysOrdersHelperComputed,
  applicationContextPublic,
);

let state;
describe('todaysOrdersHelper', () => {
  beforeEach(() => {
    state = {
      todaysOrders: {
        results: [
          {
            caseCaption: 'Sauceboss, Petitioner',
            docketEntryId: 'document-id-123',
            docketNumber: '123-20',
            documentType: 'Order',
            filingDate: '2020-06-11T20:17:10.646Z',
            signedJudgeName: 'Roslindis Angelino',
          },
        ],
      },
    };
  });

  it('should set the formattedJudgeName based on the judge field when the document is a SPOS', () => {
    const result = runCompute(todaysOrdersHelper, {
      state: {
        todaysOrders: {
          results: [
            {
              caseCaption: 'Sauceboss, Petitioner',
              docketEntryId: 'document-id-123',
              docketNumber: '123-20',
              documentType: 'Order',
              eventCode: 'SPOS',
              filingDate: '2020-06-11T20:17:10.646Z',
              judge: 'Cohen',
              signedJudgeName: 'Roslindis Angelino',
            },
          ],
        },
      },
    });
    expect(result.formattedOrders).toMatchObject([
      {
        caseCaption: 'Sauceboss, Petitioner',
        formattedFilingDate: '06/11/20',
        formattedJudgeName: 'Cohen',
      },
    ]);
  });

  it('should return the formattedOrders as an array', () => {
    const result = runCompute(todaysOrdersHelper, { state });
    expect(Array.isArray(result.formattedOrders)).toBeTruthy();
    expect(result.formattedOrders).toMatchObject([
      {
        caseCaption: 'Sauceboss, Petitioner',
        formattedFilingDate: '06/11/20',
        formattedJudgeName: 'Angelino',
      },
    ]);
  });

  it('should return formattedCurrentDate', () => {
    const result = runCompute(todaysOrdersHelper, { state });

    const currentDate = applicationContextPublic
      .getUtilities()
      .createISODateString();
    const formattedCurrentDate = applicationContextPublic
      .getUtilities()
      .formatDateString(currentDate, 'MONTH_DAY_YEAR');

    expect(result.formattedCurrentDate).toEqual(formattedCurrentDate);
  });

  it('sets numberOfPagesFormatted to n/a if numberOfPages is undefined', () => {
    const result = runCompute(todaysOrdersHelper, { state });
    expect(result.formattedOrders).toMatchObject([
      {
        numberOfPagesFormatted: 'n/a',
      },
    ]);
  });

  it('sets numberOfPagesFormatted to 0 if numberOfPages is 0', () => {
    state.todaysOrders.results[0].numberOfPages = 0;
    const result = runCompute(todaysOrdersHelper, { state });
    expect(result.formattedOrders).toMatchObject([
      {
        numberOfPagesFormatted: 0,
      },
    ]);
  });

  describe('proxy sort order parameter', () => {
    it('should return todaysOrdersSort either from state if defined', () => {
      const result = runCompute(todaysOrdersHelper, {
        state: {
          sessionMetadata: {
            todaysOrdersSort: 'meatloaf',
          },
          todaysOrders: {
            results: [],
          },
        },
      });

      expect(result.todaysOrdersSort).toEqual('meatloaf');
    });

    it('should return todaysOrdersSort from constants when not defined in state', () => {
      const result = runCompute(todaysOrdersHelper, {
        state: {
          sessionMetadata: {},
          todaysOrders: {
            results: [],
          },
        },
      });
      expect(result.todaysOrdersSort).toEqual(
        applicationContextPublic.getConstants().TODAYS_ORDERS_SORT_DEFAULT,
      );
    });
  });

  it('should return the total count based on state.todaysOrders.totalCount', () => {
    state = {
      todaysOrders: {
        results: state.todaysOrders.results,
        totalCount: 21,
      },
    };

    const result = runCompute(todaysOrdersHelper, { state });

    expect(result.totalCount).toBe(21);
  });

  it('should return a list of sort options', () => {
    const result = runCompute(todaysOrdersHelper, {
      state: {
        todaysOrders: {
          results: state.todaysOrders.results,
          totalCount: 21,
        },
      },
    });

    expect(result.sortOptions.length).toBe(12);
  });

  describe('hasResults', () => {
    it('should be true when formattedOrders is not an empty list', () => {
      const result = runCompute(todaysOrdersHelper, { state });
      expect(result.hasResults).toBeTruthy();
    });

    it('should be false when formattedOrders is an empty list', () => {
      state = { todaysOrders: { results: [] } };

      const result = runCompute(todaysOrdersHelper, { state });

      expect(result.hasResults).toBeFalsy();
    });
  });

  describe('showLoadMoreButton', () => {
    it('should be true when formattedOrders.length is less than the total result count', () => {
      state = { todaysOrders: { results: [], totalCount: 5 } };

      const result = runCompute(todaysOrdersHelper, { state });

      expect(result.showLoadMoreButton).toBeTruthy();
    });

    it('should be false when formattedOrders.length is equal to the total result count', () => {
      state = {
        todaysOrders: {
          results: state.todaysOrders.results,
          totalCount: 1,
        },
      };

      const result = runCompute(todaysOrdersHelper, { state });

      expect(result.showLoadMoreButton).toBeFalsy();
    });
  });

  describe('formattedOrders', () => {
    it('should sort by filing date ascending', () => {
      state = {
        tableSort: {
          sortField: 'filingDate',
          sortOrder: 'asc',
        },
        todaysOrders: {
          results: [
            {
              filingDate: '2020-06-11T20:17:10.646Z',
            },
            {
              filingDate: '2030-06-11T20:17:10.646Z',
            },
            {
              filingDate: '2025-06-11T20:17:10.646Z',
            },
          ],
        },
      };

      const result = runCompute(todaysOrdersHelper, { state });

      expect(result.formattedOrders).toEqual([
        {
          filingDate: '2020-06-11T20:17:10.646Z',
          formattedFilingDate: '06/11/20',
          formattedJudgeName: '',
          numberOfPagesFormatted: 'n/a',
        },
        {
          filingDate: '2025-06-11T20:17:10.646Z',
          formattedFilingDate: '06/11/25',
          formattedJudgeName: '',
          numberOfPagesFormatted: 'n/a',
        },
        {
          filingDate: '2030-06-11T20:17:10.646Z',
          formattedFilingDate: '06/11/30',
          formattedJudgeName: '',
          numberOfPagesFormatted: 'n/a',
        },
      ]);
    });

    it('should sort by docketNumber', () => {
      state = {
        tableSort: {
          sortField: 'docketNumber',
          sortOrder: 'asc',
        },
        todaysOrders: {
          results: [
            { docketNumber: '10323-25' },
            { docketNumber: '15607-20' },
            { docketNumber: '15619-20' },
            { docketNumber: '15631-22' },
            { docketNumber: '16017-21' },
          ],
        },
      };

      const result = runCompute(todaysOrdersHelper, { state });

      expect(result.formattedOrders).toEqual([
        {
          docketNumber: '15607-20',
          formattedFilingDate: '',
          formattedJudgeName: '',
          numberOfPagesFormatted: 'n/a',
        },
        {
          docketNumber: '15619-20',
          formattedFilingDate: '',
          formattedJudgeName: '',
          numberOfPagesFormatted: 'n/a',
        },
        {
          docketNumber: '16017-21',
          formattedFilingDate: '',
          formattedJudgeName: '',
          numberOfPagesFormatted: 'n/a',
        },
        {
          docketNumber: '15631-22',
          formattedFilingDate: '',
          formattedJudgeName: '',
          numberOfPagesFormatted: 'n/a',
        },
        {
          docketNumber: '10323-25',
          formattedFilingDate: '',
          formattedJudgeName: '',
          numberOfPagesFormatted: 'n/a',
        },
      ]);
    });

    it('should not sort if state.tableSort does not exist', () => {
      state = {
        todaysOrders: {
          results: [
            { filingDate: '2020-06-11T20:17:10.646Z' },
            { filingDate: '2030-06-11T20:17:10.646Z' },
            { filingDate: '2025-06-11T20:17:10.646Z' },
          ],
        },
      };

      const result = runCompute(todaysOrdersHelper, { state });

      expect(result.formattedOrders).toEqual([
        {
          filingDate: '2020-06-11T20:17:10.646Z',
          formattedFilingDate: '06/11/20',
          formattedJudgeName: '',
          numberOfPagesFormatted: 'n/a',
        },
        {
          filingDate: '2030-06-11T20:17:10.646Z',
          formattedFilingDate: '06/11/30',
          formattedJudgeName: '',
          numberOfPagesFormatted: 'n/a',
        },
        {
          filingDate: '2025-06-11T20:17:10.646Z',
          formattedFilingDate: '06/11/25',
          formattedJudgeName: '',
          numberOfPagesFormatted: 'n/a',
        },
      ]);
    });
  });

  it('should sort by numberOfPages ascending', () => {
    state = {
      tableSort: {
        sortField: 'numberOfPages',
        sortOrder: 'asc',
      },
      todaysOrders: {
        results: [
          { numberOfPages: 10 },
          { numberOfPages: undefined },
          { numberOfPages: 5 },
          { numberOfPages: 20 },
        ],
      },
    };

    const result = runCompute(todaysOrdersHelper, { state });

    expect(result.formattedOrders).toEqual([
      {
        formattedFilingDate: '',
        formattedJudgeName: '',
        numberOfPagesFormatted: 'n/a',
      },
      {
        numberOfPages: 5,
        formattedFilingDate: '',
        formattedJudgeName: '',
        numberOfPagesFormatted: 5,
      },
      {
        numberOfPages: 10,
        formattedFilingDate: '',
        formattedJudgeName: '',
        numberOfPagesFormatted: 10,
      },
      {
        numberOfPages: 20,
        formattedFilingDate: '',
        formattedJudgeName: '',
        numberOfPagesFormatted: 20,
      },
    ]);
  });
});
