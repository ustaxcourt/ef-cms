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
