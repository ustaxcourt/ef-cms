import { getPaperServiceAlertWarningAction } from './getPaperServiceAlertWarningAction';
import { runAction } from 'cerebral/test';

describe('getPaperServiceAlertWarningAction', () => {
  it('returns the paper service warning alert', async () => {
    const results = await runAction(getPaperServiceAlertWarningAction, {
      state: {},
    });

    expect(results.output.alertWarning).toEqual({
      message:
        'This document has not been electronically served. Print and mail to complete paper service.',
    });
  });
});
