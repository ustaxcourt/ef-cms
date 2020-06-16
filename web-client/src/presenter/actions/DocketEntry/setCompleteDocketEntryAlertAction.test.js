import { runAction } from 'cerebral/test';
import { setCompleteDocketEntryAlertAction } from './setCompleteDocketEntryAlertAction';

describe('setCompleteDocketEntryAlertAction', () => {
  it('sets success message for completing a docket entry', async () => {
    const result = await runAction(setCompleteDocketEntryAlertAction, {
      props: {
        updatedDocument: {
          documentTitle: 'Diners, Drive-ins, and Dives',
        },
      },
    });

    expect(result.output).toMatchObject({
      alertSuccess: {
        message: 'Diners, Drive-ins, and Dives QC completed and message sent.',
      },
    });
  });
});
