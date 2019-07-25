import { computeSecondaryFormDateAction } from './computeSecondaryFormDateAction';
import { runAction } from 'cerebral/test';

describe('computeSecondaryFormDateAction', () => {
  it("computes the secondaryDocument's date as the service date", async () => {
    const result = await runAction(computeSecondaryFormDateAction, {
      state: {
        form: {
          secondaryDocument: {
            day: '6',
            documentType: 'Proposed Stipulated Decision',
            month: '1',
            year: '2019',
          },
        },
      },
    });

    expect(result.state.form.secondaryDocument.serviceDate).toEqual(
      '2019-01-06',
    );
  });
});
