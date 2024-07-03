import { prepareStatusReportOrderResponseAction } from '@web-client/presenter/actions/prepareStatusReportOrderResponseAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('prepareStatusReportOrderResponseAction,', () => {
  const statusReportFilingDate = '04/04/2024';
  const statusReportIndex = 4;
  const expectedFiledLine = `<p class="indent-paragraph">On ${statusReportFilingDate}, a status report was filed in this case (Index no. ${statusReportIndex}). For cause, it is</p>`;

  it('prepare status report with no options selected', async () => {
    const result = await runAction(prepareStatusReportOrderResponseAction, {
      state: {
        form: {
          additionalOrderText: undefined,
          docketEntryDescription: 'Order',
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

    expect(result.state.form.documentTitle).toEqual('Order');
    expect(result.state.form.eventCode).toEqual('O');
    expect(result.state.form.richText).toEqual(expectedFiledLine);
  });

  it('prepare status report with all options selected', async () => {
    const additionalOrderText = 'Test Additional Order Text';
    const dueDate = '2024-07-04';
    const jurisdiction = 'retained'; // TODO: use enum?
    const orderType = 'statusReport'; // TODO: use enum?
    const strickenFromTrialSessions = true;
    const expectedFullText =
      '<p class="indent-paragraph">On 04/04/2024, a status report was filed in this case (Index no. 4). For cause, it is</p><p class="indent-paragraph">ORDERED that the parties shall file a further status report by 2024-07-04. It is further</p><p class="indent-paragraph">ORDERED that this case is stricken from the trial session. It is further</p><p class="indent-paragraph">ORDERED that jurisdiction is retained by the undersigned. It is further</p><p class="indent-paragraph">ORDERED that Test Additional Order Text</p>';

    const result = await runAction(prepareStatusReportOrderResponseAction, {
      state: {
        form: {
          additionalOrderText,
          dueDate,
          jurisdiction,
          orderType,
          strickenFromTrialSessions,
        },
        statusReportOrderResponse: {
          statusReportFilingDate,
          statusReportIndex,
        },
      },
    });

    expect(result.state.form.richText).toEqual(expectedFullText);
  });

  it.each([
    [
      'retained',
      '<p class="indent-paragraph">On 04/04/2024, a status report was filed in this case (Index no. 4). For cause, it is</p><p class="indent-paragraph">ORDERED that jurisdiction is retained by the undersigned.</p>',
    ],
    [
      'restoredToGeneralDocket',
      '<p class="indent-paragraph">On 04/04/2024, a status report was filed in this case (Index no. 4). For cause, it is</p><p class="indent-paragraph">ORDERED that this case is restored to the general docket.</p>',
    ],
  ])(
    'should have correct output for jurisdiction %s',
    async (input, output) => {
      const result = await runAction(prepareStatusReportOrderResponseAction, {
        state: {
          form: {
            jurisdiction: input,
          },
          statusReportOrderResponse: {
            statusReportFilingDate,
            statusReportIndex,
          },
        },
      });

      expect(result.state.form.richText).toBe(output);
    },
  );

  it.each([
    [
      'statusReport',
      '<p class="indent-paragraph">On 04/04/2024, a status report was filed in this case (Index no. 4). For cause, it is</p><p class="indent-paragraph">ORDERED that the parties shall file a further status report by 2024-07-04.</p>',
    ],
    [
      'orStipulatedDecision',
      '<p class="indent-paragraph">On 04/04/2024, a status report was filed in this case (Index no. 4). For cause, it is</p><p class="indent-paragraph">ORDERED that the parties shall file a status report or proposed stipulated decision by 2024-07-04.</p>',
    ],
  ])('should have correct output for order type %s', async (input, output) => {
    const result = await runAction(prepareStatusReportOrderResponseAction, {
      state: {
        form: {
          dueDate: '2024-07-04',
          orderType: input,
        },
        statusReportOrderResponse: {
          statusReportFilingDate,
          statusReportIndex,
        },
      },
    });

    expect(result.state.form.richText).toBe(output);
  });
});
