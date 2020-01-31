import { computeFilingFormDateAction } from './computeFilingFormDateAction';
import { runAction } from 'cerebral/test';

describe('computeFilingFormDateAction', () => {
  it("computes the document's filingDate from date parts", async () => {
    const result = await runAction(computeFilingFormDateAction, {
      state: {
        form: {
          documentType: 'Proposed Stipulated Decision',
          filingDateDay: '6',
          filingDateMonth: '1',
          filingDateYear: '2019',
        },
      },
    });

    expect(result.state.form.filingDate).toEqual('2019-01-06');
  });

  it("does not set document's filingDate when some value needed is not present", async () => {
    const result = await runAction(computeFilingFormDateAction, {
      state: {
        form: {
          documentType: 'Proposed Stipulated Decision',
          filingDateDay: '6',
          filingDateYear: '2019',
        },
      },
    });

    expect(result.state.form.filingDate).toBeUndefined();
  });
});
