import { computeFormDateAction } from './computeFormDateAction';
import { runAction } from 'cerebral/test';

describe('computeFormDateAction', () => {
  it("computes the document's date as the service date", async () => {
    const result = await runAction(computeFormDateAction, {
      state: {
        form: {
          day: '6',
          documentType: 'Proposed Stipulated Decision',
          month: '1',
          year: '2019',
        },
      },
    });

    expect(result.state.form.serviceDate).toEqual('2019-01-06');
  });

  it("unset the document's date when some value needed is not present", async () => {
    const result = await runAction(computeFormDateAction, {
      state: {
        form: {
          day: '6',
          documentType: 'Proposed Stipulated Decision',
          serviceDate: '2019-01-06',
          year: '2019',
        },
      },
    });

    expect(result.state.form.serviceDate).toBeUndefined();
  });
});
