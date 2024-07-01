import { prepareStatusReportOrderResponseAction } from '@web-client/presenter/actions/prepareStatusReportOrderResponseAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('prepareStatusReportOrderResponseAction,', () => {
  // generate blank status report

  const statusReportFilingDate = '04/04/2024';
  const statusReportIndex = 4;
  const expectedFiledLine = `<p class="indent-paragraph">On ${statusReportFilingDate}, a status report was filed in this case (Index no. ${statusReportIndex}). For cause, it is</p>`;

  it('prepare status report with no options selected', async () => {
    const result = await runAction(prepareStatusReportOrderResponseAction, {
      state: {
        form: {
          additionalOrderText: undefined,
          dueDate: undefined,
          jurisdiction: undefined,
          orderType: undefined,
          strickenFromTrialSessions: undefined,
        },
        statusReportOrderResponse: {
          statusReportFilingDate,
          statusReportIndex,
        },
      },
    });

    expect(result.state.form.richText).toEqual(expectedFiledLine);
  });

  // generate status report will all options

  // jurisdiction branching logic

  //order type branching logic
});
