import { getDocketEntryAlertSuccessAction } from './getDocketEntryAlertSuccessAction';
import { runAction } from 'cerebral/test';

describe('getDocketEntryAlertSuccessAction', () => {
  it('should return alert object', async () => {
    const result = await runAction(getDocketEntryAlertSuccessAction, {
      props: {},
      state: {},
    });

    expect(result).toBeTruthy();
  });

  it('should return alert object when updating with file', async () => {
    const result = await runAction(getDocketEntryAlertSuccessAction, {
      props: {},
      state: {
        isUpdatingWithFile: true,
      },
    });

    expect(result.output).toMatchObject({
      alertSuccess: {
        message:
          'You can view the document by clicking on the docket entry below.',
        title: 'Your document has been saved to the entry.',
      },
    });
  });
});
