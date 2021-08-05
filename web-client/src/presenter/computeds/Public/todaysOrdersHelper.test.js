import { applicationContextPublic } from '../../../applicationContextPublic';
import { runCompute } from 'cerebral/test';
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
            signedJudgeName: 'Guy Fieri',
          },
        ],
      },
    };
  });

  it('should return the formattedOrders as an array', () => {
    const result = runCompute(todaysOrdersHelper, { state });
    expect(Array.isArray(result.formattedOrders)).toBeTruthy();
    expect(result.formattedOrders).toMatchObject([
      {
        caseCaption: 'Sauceboss, Petitioner',
        formattedFilingDate: '06/11/20',
        formattedJudgeName: 'Fieri',
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
      .formatDateString(currentDate, 'MMMM D, YYYY');

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

  it('sets numberOfPagesFormatted to n/a if numberOfPages is undefined', () => {
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

    expect(result.sortOptions.length).toBe(4);
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
});
