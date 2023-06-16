import { getDocketEntryAlertSuccessAction } from './getDocketEntryAlertSuccessAction';
import { runAction } from '@web-client/presenter/test.cerebral';

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
        message: 'Entry updated.',
      },
    });
  });
});
