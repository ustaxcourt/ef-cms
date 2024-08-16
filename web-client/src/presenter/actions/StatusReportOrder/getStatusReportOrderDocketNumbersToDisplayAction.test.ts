import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getStatusReportOrderDocketNumbersToDisplayAction } from './getStatusReportOrderDocketNumbersToDisplayAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getStatusReportOrderDocketNumbersToDisplayAction,', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it("should use the case's docket number as the docket number to display when the case is not a lead case", async () => {
    const docketNumber = '1234-ABC';
    const result = await runAction(
      getStatusReportOrderDocketNumbersToDisplayAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            consolidatedCases: [],
            docketNumber,
            leadDocketNumber: null,
          },
        },
      },
    );

    const expectedResult = [docketNumber];

    expect(result.state.statusReportOrder.docketNumbersToDisplay).toEqual(
      expectedResult,
    );
  });

  it('should use the case numbers associated with the case as the docket numbers to display when the case is a lead case', async () => {
    const docketNumber = '1234-ABC';
    const leadDocketNumber = '1234-ABC';

    const result = await runAction(
      getStatusReportOrderDocketNumbersToDisplayAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            consolidatedCases: [
              { docketNumber: '1234-ABC' },
              { docketNumber: '2345-BCD' },
              { docketNumber: '3456-CDE' },
            ],
            docketNumber,
            leadDocketNumber,
          },
        },
      },
    );

    const expectedResult = ['1234-ABC', '2345-BCD', '3456-CDE'];

    expect(result.state.statusReportOrder.docketNumbersToDisplay).toEqual(
      expectedResult,
    );
  });

  it('should sort the case numbers associated with the lead case', async () => {
    const docketNumber = '1234-ABC';
    const leadDocketNumber = '1234-ABC';

    const result = await runAction(
      getStatusReportOrderDocketNumbersToDisplayAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            consolidatedCases: [
              { docketNumber: '3456-CDE' },
              { docketNumber: '2345-BCD' },
              { docketNumber: '1234-ABC' },
            ],
            docketNumber,
            leadDocketNumber,
          },
        },
      },
    );

    const expectedResult = ['1234-ABC', '2345-BCD', '3456-CDE'];

    expect(result.state.statusReportOrder.docketNumbersToDisplay).toEqual(
      expectedResult,
    );
  });
});
