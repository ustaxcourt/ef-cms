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
});
