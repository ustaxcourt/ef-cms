import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getPaperServiceAlertWarningAction } from './getPaperServiceAlertWarningAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getPaperServiceAlertWarningAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set the paper service warning alert without a warning about electronic service when at least one party on the case has electronic service', async () => {
    applicationContext
      .getUtilities()
      .hasPartyWithServiceType.mockReturnValue(true);

    const results = await runAction(getPaperServiceAlertWarningAction, {
      modules: {
        presenter,
      },
    });

    expect(results.output.alertWarning).toEqual({
      message: 'Print and mail to complete paper service.',
    });
  });

  it('should set the paper service warning alert with a warning about electronic service when no one on the case has electronic service', async () => {
    applicationContext
      .getUtilities()
      .hasPartyWithServiceType.mockReturnValue(false);

    const results = await runAction(getPaperServiceAlertWarningAction, {
      modules: {
        presenter,
      },
    });

    expect(results.output.alertWarning).toEqual({
      message:
        'This document has not been electronically served. Print and mail to complete paper service.',
    });
  });
});
